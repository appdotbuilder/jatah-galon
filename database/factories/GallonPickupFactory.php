<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\GallonRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\GallonPickup>
 */
class GallonPickupFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $pickedUpAt = fake()->dateTimeBetween('-30 days', 'now');
        
        return [
            'employee_id' => Employee::factory(),
            'gallon_request_id' => GallonRequest::factory(),
            'quantity' => fake()->numberBetween(1, 5),
            'picked_up_at' => $pickedUpAt,
            'month' => (int) $pickedUpAt->format('n'),
            'year' => (int) $pickedUpAt->format('Y'),
        ];
    }
}