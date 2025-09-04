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
        Schema::create('gallon_pickups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->foreignId('gallon_request_id')->constrained()->onDelete('cascade');
            $table->integer('quantity')->comment('Number of gallons picked up');
            $table->timestamp('picked_up_at')->comment('When the gallons were picked up');
            $table->integer('month')->comment('Month of pickup for quota calculation');
            $table->integer('year')->comment('Year of pickup for quota calculation');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('employee_id');
            $table->index('picked_up_at');
            $table->index(['employee_id', 'month', 'year']);
            $table->index(['month', 'year']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gallon_pickups');
    }
};