<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('gallon_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->integer('quantity')->comment('Number of gallons requested');
            $table->enum('status', ['pending', 'approved', 'verified_stock', 'completed', 'rejected'])->default('pending');
            $table->timestamp('requested_at')->comment('When the request was made');
            $table->timestamp('approved_at')->nullable()->comment('When admin approved the request');
            $table->timestamp('stock_verified_at')->nullable()->comment('When warehouse verified stock');
            $table->timestamp('completed_at')->nullable()->comment('When employee picked up gallons');
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('stock_verified_by')->nullable()->constrained('users')->onDelete('set null');
            $table->text('notes')->nullable()->comment('Additional notes');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('employee_id');
            $table->index('status');
            $table->index('requested_at');
            $table->index(['status', 'requested_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gallon_requests');
    }
};