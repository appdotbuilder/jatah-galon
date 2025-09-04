<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\GallonRequest;
use App\Models\GallonPickup;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Create admin users
        $hrAdmin = User::create([
            'name' => 'Admin HR',
            'email' => 'hr@company.com',
            'password' => Hash::make('password'),
            'role' => 'hr_admin',
            'email_verified_at' => now(),
        ]);

        $administrator = User::create([
            'name' => 'Administrator',
            'email' => 'admin@company.com',
            'password' => Hash::make('password'),
            'role' => 'administrator',
            'email_verified_at' => now(),
        ]);

        $warehouseAdmin = User::create([
            'name' => 'Admin Gudang',
            'email' => 'warehouse@company.com',
            'password' => Hash::make('password'),
            'role' => 'warehouse_admin',
            'email_verified_at' => now(),
        ]);

        // Create sample employees with different grades
        $employees = [
            [
                'employee_id' => 'EMP001',
                'name' => 'Ahmad Sudrajat',
                'department' => 'IT',
                'grade' => 'G7',
                'monthly_allowance' => 24,
                'is_active' => true,
            ],
            [
                'employee_id' => 'EMP002',
                'name' => 'Siti Nurhaliza',
                'department' => 'HR',
                'grade' => 'G8',
                'monthly_allowance' => 24,
                'is_active' => true,
            ],
            [
                'employee_id' => 'EMP003',
                'name' => 'Budi Santoso',
                'department' => 'Finance',
                'grade' => 'G9',
                'monthly_allowance' => 12,
                'is_active' => true,
            ],
            [
                'employee_id' => 'EMP004',
                'name' => 'Dewi Lestari',
                'department' => 'Operations',
                'grade' => 'G10',
                'monthly_allowance' => 10,
                'is_active' => true,
            ],
            [
                'employee_id' => 'EMP005',
                'name' => 'Rudi Hermawan',
                'department' => 'Marketing',
                'grade' => 'G11',
                'monthly_allowance' => 7,
                'is_active' => true,
            ],
            [
                'employee_id' => 'EMP006',
                'name' => 'Rina Kartika',
                'department' => 'Sales',
                'grade' => 'G12',
                'monthly_allowance' => 7,
                'is_active' => true,
            ],
            [
                'employee_id' => 'EMP007',
                'name' => 'Andi Wijaya',
                'department' => 'IT',
                'grade' => 'G13',
                'monthly_allowance' => 7,
                'is_active' => false, // Inactive employee
            ],
        ];

        foreach ($employees as $employeeData) {
            Employee::create($employeeData);
        }

        // Create some sample gallon requests and pickups
        $activeEmployees = Employee::where('is_active', true)->get();
        
        foreach ($activeEmployees as $employee) {
            // Create some completed requests from previous days
            for ($i = 0; $i < random_int(1, 3); $i++) {
                $requestDate = now()->subDays(random_int(1, 15));
                $quantity = random_int(1, min(5, $employee->monthly_allowance));
                
                $request = GallonRequest::create([
                    'employee_id' => $employee->id,
                    'quantity' => $quantity,
                    'status' => 'completed',
                    'requested_at' => $requestDate,
                    'approved_at' => $requestDate->copy()->addMinutes(random_int(30, 180)),
                    'stock_verified_at' => $requestDate->copy()->addMinutes(random_int(200, 300)),
                    'completed_at' => $requestDate->copy()->addMinutes(random_int(320, 480)),
                    'approved_by' => $administrator->id,
                    'stock_verified_by' => $warehouseAdmin->id,
                ]);

                GallonPickup::create([
                    'employee_id' => $employee->id,
                    'gallon_request_id' => $request->id,
                    'quantity' => $quantity,
                    'picked_up_at' => $request->completed_at,
                    'month' => $request->completed_at->month,
                    'year' => $request->completed_at->year,
                ]);
            }

            // Create some pending requests for today
            if (random_int(1, 100) <= 60) { // 60% chance
                GallonRequest::create([
                    'employee_id' => $employee->id,
                    'quantity' => random_int(1, min(3, $employee->getRemainingAllowance())),
                    'status' => ['pending', 'approved', 'verified_stock'][random_int(0, 2)],
                    'requested_at' => now()->subMinutes(random_int(10, 240)),
                    'approved_at' => random_int(1, 100) <= 70 ? now()->subMinutes(random_int(5, 120)) : null,
                    'approved_by' => random_int(1, 100) <= 70 ? $administrator->id : null,
                ]);
            }
        }
    }
}