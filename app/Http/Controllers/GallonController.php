<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\GallonRequest;
use App\Models\GallonPickup;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GallonController extends Controller
{
    /**
     * Display the main gallon management page.
     */
    public function index()
    {
        return Inertia::render('welcome');
    }

    /**
     * Show employee dashboard (identify employee).
     */
    public function show(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|string|exists:employees,employee_id'
        ]);

        $employee = Employee::where('employee_id', $request->employee_id)
            ->where('is_active', true)
            ->first();

        if (!$employee) {
            return back()->withErrors(['employee_id' => 'Employee not found or inactive.']);
        }

        // Get current month/year
        $currentMonth = now()->month;
        $currentYear = now()->year;

        // Get pickups for current month
        $pickups = $employee->gallonPickups()
            ->where('month', $currentMonth)
            ->where('year', $currentYear)
            ->with('gallonRequest')
            ->orderBy('picked_up_at', 'desc')
            ->get();

        // Get pending requests
        $pendingRequests = $employee->gallonRequests()
            ->where('status', 'verified_stock')
            ->orderBy('requested_at', 'desc')
            ->get();

        // Calculate totals
        $totalUsed = $pickups->sum('quantity');
        $remainingAllowance = max(0, $employee->monthly_allowance - $totalUsed);

        return Inertia::render('employee-dashboard', [
            'employee' => $employee,
            'monthlyAllowance' => $employee->monthly_allowance,
            'totalUsed' => $totalUsed,
            'remainingAllowance' => $remainingAllowance,
            'pickups' => $pickups,
            'pendingRequests' => $pendingRequests,
            'currentMonth' => now()->format('F Y'),
        ]);
    }

    /**
     * Create a new gallon request.
     */
    public function store(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'quantity' => 'required|integer|min:1|max:10',
        ]);

        $employee = Employee::findOrFail($request->employee_id);
        
        // Check remaining allowance
        $remainingAllowance = $employee->getRemainingAllowance();
        
        if ($request->quantity > $remainingAllowance) {
            return back()->withErrors(['quantity' => 'Requested quantity exceeds remaining allowance.']);
        }

        // Create the request
        GallonRequest::create([
            'employee_id' => $employee->id,
            'quantity' => $request->quantity,
            'status' => 'pending',
            'requested_at' => now(),
        ]);

        return back()->with('success', 'Gallon request submitted successfully.');
    }

    /**
     * Update gallon request (complete pickup).
     */
    public function update(Request $request)
    {
        $action = $request->get('action');
        
        if ($action === 'pickup') {
            $request->validate([
                'request_id' => 'required|exists:gallon_requests,id',
            ]);

            $gallonRequest = GallonRequest::findOrFail($request->request_id);
            
            if (!$gallonRequest->canBeCompleted()) {
                return back()->withErrors(['error' => 'This request cannot be completed.']);
            }

            // Create pickup record
            GallonPickup::create([
                'employee_id' => $gallonRequest->employee_id,
                'gallon_request_id' => $gallonRequest->id,
                'quantity' => $gallonRequest->quantity,
                'picked_up_at' => now(),
                'month' => now()->month,
                'year' => now()->year,
            ]);

            // Update request status
            $gallonRequest->update([
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            return back()->with('success', 'Gallon pickup confirmed successfully.');
        }
        
        return back()->withErrors(['error' => 'Invalid action.']);
    }
}