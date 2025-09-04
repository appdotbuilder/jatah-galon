<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GallonRequest;
use App\Models\GallonPickup;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\ExportService;

class RequestController extends Controller
{
    /**
     * Display daily gallon requests for admin verification.
     */
    public function index()
    {
        $date = request('date', now()->format('Y-m-d'));
        
        $requests = GallonRequest::with(['employee'])
            ->whereDate('requested_at', $date)
            ->orderBy('requested_at', 'desc')
            ->paginate(20);
        
        return Inertia::render('admin/requests/index', [
            'requests' => $requests,
            'selectedDate' => $date,
        ]);
    }

    /**
     * Update the specified request (handles approve, reject, verify-stock).
     */
    public function update(Request $request, GallonRequest $gallonRequest)
    {
        $action = $request->get('action');
        
        switch ($action) {
            case 'approve':
                if (!$gallonRequest->canBeApproved()) {
                    return back()->withErrors(['error' => 'This request cannot be approved.']);
                }

                $gallonRequest->update([
                    'status' => 'approved',
                    'approved_at' => now(),
                    'approved_by' => auth()->id(),
                ]);

                return back()->with('success', 'Request approved successfully.');
                
            case 'reject':
                $request->validate([
                    'notes' => 'required|string|max:500'
                ]);

                if (!$gallonRequest->canBeApproved()) {
                    return back()->withErrors(['error' => 'This request cannot be rejected.']);
                }

                $gallonRequest->update([
                    'status' => 'rejected',
                    'notes' => $request->notes,
                ]);

                return back()->with('success', 'Request rejected.');
                
            case 'verify-stock':
                if (!$gallonRequest->canVerifyStock()) {
                    return back()->withErrors(['error' => 'Stock cannot be verified for this request.']);
                }

                $gallonRequest->update([
                    'status' => 'verified_stock',
                    'stock_verified_at' => now(),
                    'stock_verified_by' => auth()->id(),
                ]);

                return back()->with('success', 'Stock verified. Gallon is ready for pickup.');
                
            default:
                return back()->withErrors(['error' => 'Invalid action.']);
        }
    }


}