<?php

use App\Http\Controllers\GallonController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\RequestController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Main gallon management routes (public access)
Route::controller(GallonController::class)->group(function () {
    Route::get('/', 'index')->name('gallon.index');
    Route::get('/employee', 'show')->name('gallon.show');
    Route::post('/request', 'store')->name('gallon.store');
    Route::patch('/pickup', 'update')->name('gallon.update');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Admin routes
    Route::prefix('admin')->name('admin.')->group(function () {
        // Employee management (HR Admin only)
        Route::resource('employees', EmployeeController::class);
        
        // Request management (Administrator and Warehouse)
        Route::controller(RequestController::class)->prefix('requests')->name('requests.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::patch('/{gallonRequest}', 'update')->name('update');
        });
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
