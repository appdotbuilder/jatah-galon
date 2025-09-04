<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user() && auth()->user()->role === 'hr_admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'employee_id' => 'required|string|max:20|unique:employees,employee_id,' . $this->route('employee')->id,
            'name' => 'required|string|max:255',
            'department' => 'nullable|string|max:255',
            'grade' => 'required|in:G7,G8,G9,G10,G11,G12,G13',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'employee_id.required' => 'Employee ID is required.',
            'employee_id.unique' => 'This Employee ID is already registered to another employee.',
            'name.required' => 'Employee name is required.',
            'grade.required' => 'Grade is required.',
            'grade.in' => 'Invalid grade selected.',
        ];
    }
}