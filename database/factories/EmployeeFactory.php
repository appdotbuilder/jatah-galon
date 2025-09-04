<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employee>
 */
class EmployeeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $grade = fake()->randomElement(['G7', 'G8', 'G9', 'G10', 'G11', 'G12', 'G13']);
        
        return [
            'employee_id' => fake()->unique()->numerify('EMP####'),
            'name' => fake()->name(),
            'department' => fake()->randomElement(['IT', 'HR', 'Finance', 'Operations', 'Marketing', 'Sales']),
            'grade' => $grade,
            'monthly_allowance' => Employee::getAllowanceByGrade($grade),
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the employee is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Create employee with specific grade.
     */
    public function grade(string $grade): static
    {
        return $this->state(fn (array $attributes) => [
            'grade' => $grade,
            'monthly_allowance' => Employee::getAllowanceByGrade($grade),
        ]);
    }
}