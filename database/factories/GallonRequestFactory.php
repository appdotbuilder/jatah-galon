<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\GallonRequest>
 */
class GallonRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'employee_id' => Employee::factory(),
            'quantity' => fake()->numberBetween(1, 5),
            'status' => 'pending',
            'requested_at' => fake()->dateTimeBetween('-30 days', 'now'),
            'notes' => fake()->optional()->sentence(),
        ];
    }

    /**
     * Indicate that the request is approved.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
            'approved_at' => fake()->dateTimeBetween($attributes['requested_at'] ?? '-30 days', 'now'),
            'approved_by' => User::factory(),
        ]);
    }

    /**
     * Indicate that the stock is verified.
     */
    public function stockVerified(): static
    {
        return $this->approved()->state(fn (array $attributes) => [
            'status' => 'verified_stock',
            'stock_verified_at' => fake()->dateTimeBetween($attributes['approved_at'] ?? '-30 days', 'now'),
            'stock_verified_by' => User::factory(),
        ]);
    }

    /**
     * Indicate that the request is completed.
     */
    public function completed(): static
    {
        return $this->stockVerified()->state(fn (array $attributes) => [
            'status' => 'completed',
            'completed_at' => fake()->dateTimeBetween($attributes['stock_verified_at'] ?? '-30 days', 'now'),
        ]);
    }
}