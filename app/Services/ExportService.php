<?php

namespace App\Services;

use App\Models\GallonRequest;
use App\Models\GallonPickup;
use Illuminate\Support\Collection;

class ExportService
{
    /**
     * Get daily requests data for export.
     *
     * @param string $date
     * @return Collection
     */
    public function getDailyRequestsData(string $date): Collection
    {
        return GallonRequest::with(['employee', 'approvedBy', 'stockVerifiedBy'])
            ->whereDate('requested_at', $date)
            ->orderBy('requested_at')
            ->get()
            ->map(function ($request) {
                return [
                    'employee_id' => $request->employee->employee_id,
                    'employee_name' => $request->employee->name,
                    'department' => $request->employee->department,
                    'grade' => $request->employee->grade,
                    'quantity' => $request->quantity,
                    'status' => $request->status,
                    'requested_at' => $request->requested_at->format('Y-m-d H:i:s'),
                    'approved_at' => $request->approved_at?->format('Y-m-d H:i:s'),
                    'approved_by' => $request->approvedBy?->name,
                    'stock_verified_at' => $request->stock_verified_at?->format('Y-m-d H:i:s'),
                    'stock_verified_by' => $request->stockVerifiedBy?->name,
                    'completed_at' => $request->completed_at?->format('Y-m-d H:i:s'),
                    'notes' => $request->notes,
                ];
            });
    }

    /**
     * Get activity data for export by date range.
     *
     * @param string $startMonth
     * @param string $endMonth
     * @return Collection
     */
    public function getActivityData(string $startMonth, string $endMonth): Collection
    {
        $startDate = $startMonth . '-01';
        $endDate = date('Y-m-t', strtotime($endMonth . '-01'));

        return GallonPickup::with(['employee', 'gallonRequest'])
            ->whereBetween('picked_up_at', [$startDate, $endDate])
            ->orderBy('picked_up_at')
            ->get()
            ->map(function ($pickup) {
                return [
                    'employee_id' => $pickup->employee->employee_id,
                    'employee_name' => $pickup->employee->name,
                    'department' => $pickup->employee->department,
                    'grade' => $pickup->employee->grade,
                    'quantity' => $pickup->quantity,
                    'picked_up_at' => $pickup->picked_up_at->format('Y-m-d H:i:s'),
                    'month' => $pickup->month,
                    'year' => $pickup->year,
                    'request_status' => $pickup->gallonRequest->status,
                ];
            });
    }

    /**
     * Get headings for daily requests export.
     *
     * @return array
     */
    public function getDailyRequestsHeadings(): array
    {
        return [
            'Employee ID',
            'Employee Name',
            'Department',
            'Grade',
            'Quantity',
            'Status',
            'Requested At',
            'Approved At',
            'Approved By',
            'Stock Verified At',
            'Stock Verified By',
            'Completed At',
            'Notes',
        ];
    }

    /**
     * Get headings for activity export.
     *
     * @return array
     */
    public function getActivityHeadings(): array
    {
        return [
            'Employee ID',
            'Employee Name',
            'Department',
            'Grade',
            'Quantity',
            'Picked Up At',
            'Month',
            'Year',
            'Request Status',
        ];
    }
}