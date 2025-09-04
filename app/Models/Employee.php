<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Employee
 *
 * @property int $id
 * @property string $employee_id
 * @property string $name
 * @property string|null $department
 * @property string $grade
 * @property int $monthly_allowance
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\GallonRequest> $gallonRequests
 * @property-read int|null $gallon_requests_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\GallonPickup> $gallonPickups
 * @property-read int|null $gallon_pickups_count
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Employee newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Employee newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Employee query()
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereDepartment($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereEmployeeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereGrade($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereMonthlyAllowance($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee active()
 * @method static \Database\Factories\EmployeeFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Employee extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'employee_id',
        'name',
        'department',
        'grade',
        'monthly_allowance',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
        'monthly_allowance' => 'integer',
    ];

    /**
     * Get the gallon requests for the employee.
     */
    public function gallonRequests(): HasMany
    {
        return $this->hasMany(GallonRequest::class);
    }

    /**
     * Get the gallon pickups for the employee.
     */
    public function gallonPickups(): HasMany
    {
        return $this->hasMany(GallonPickup::class);
    }

    /**
     * Scope a query to only include active employees.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get monthly allowance based on grade.
     *
     * @param string $grade
     * @return int
     */
    public static function getAllowanceByGrade(string $grade): int
    {
        $allowances = [
            'G7' => 24,
            'G8' => 24,
            'G9' => 12,
            'G10' => 10,
            'G11' => 7,
            'G12' => 7,
            'G13' => 7,
        ];

        return $allowances[$grade] ?? 0;
    }

    /**
     * Get total gallons picked up in a specific month/year.
     *
     * @param int $month
     * @param int $year
     * @return int
     */
    public function getTotalPickupsForMonth(int $month, int $year): int
    {
        return $this->gallonPickups()
            ->where('month', $month)
            ->where('year', $year)
            ->sum('quantity');
    }

    /**
     * Get remaining allowance for current month.
     *
     * @return int
     */
    public function getRemainingAllowance(): int
    {
        $currentMonth = now()->month;
        $currentYear = now()->year;
        
        $usedGallons = $this->getTotalPickupsForMonth($currentMonth, $currentYear);
        
        return max(0, $this->monthly_allowance - $usedGallons);
    }
}