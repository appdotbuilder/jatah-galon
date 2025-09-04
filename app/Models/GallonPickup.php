<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\GallonPickup
 *
 * @property int $id
 * @property int $employee_id
 * @property int $gallon_request_id
 * @property int $quantity
 * @property \Illuminate\Support\Carbon $picked_up_at
 * @property int $month
 * @property int $year
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Employee $employee
 * @property-read \App\Models\GallonRequest $gallonRequest
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|GallonPickup newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|GallonPickup newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|GallonPickup query()
 * @method static \Illuminate\Database\Eloquent\Builder|GallonPickup whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonPickup whereEmployeeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonPickup whereGallonRequestId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonPickup whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonPickup whereMonth($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonPickup wherePickedUpAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonPickup whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonPickup whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonPickup whereYear($value)
 * @method static \Database\Factories\GallonPickupFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class GallonPickup extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'employee_id',
        'gallon_request_id',
        'quantity',
        'picked_up_at',
        'month',
        'year',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'picked_up_at' => 'datetime',
        'quantity' => 'integer',
        'month' => 'integer',
        'year' => 'integer',
        'employee_id' => 'integer',
        'gallon_request_id' => 'integer',
    ];

    /**
     * Get the employee who picked up gallons.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Get the gallon request associated with this pickup.
     */
    public function gallonRequest(): BelongsTo
    {
        return $this->belongsTo(GallonRequest::class);
    }
}