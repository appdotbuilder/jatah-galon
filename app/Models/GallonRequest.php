<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * App\Models\GallonRequest
 *
 * @property int $id
 * @property int $employee_id
 * @property int $quantity
 * @property string $status
 * @property \Illuminate\Support\Carbon $requested_at
 * @property \Illuminate\Support\Carbon|null $approved_at
 * @property \Illuminate\Support\Carbon|null $stock_verified_at
 * @property \Illuminate\Support\Carbon|null $completed_at
 * @property int|null $approved_by
 * @property int|null $stock_verified_by
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Employee $employee
 * @property-read \App\Models\User|null $approvedBy
 * @property-read \App\Models\User|null $stockVerifiedBy
 * @property-read \App\Models\GallonPickup|null $pickup
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest query()
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereApprovedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereApprovedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereCompletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereEmployeeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereRequestedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereStockVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereStockVerifiedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereUpdatedAt($value)
 * @method static \Database\Factories\GallonRequestFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class GallonRequest extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'employee_id',
        'quantity',
        'status',
        'requested_at',
        'approved_at',
        'stock_verified_at',
        'completed_at',
        'approved_by',
        'stock_verified_by',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'requested_at' => 'datetime',
        'approved_at' => 'datetime',
        'stock_verified_at' => 'datetime',
        'completed_at' => 'datetime',
        'quantity' => 'integer',
        'employee_id' => 'integer',
        'approved_by' => 'integer',
        'stock_verified_by' => 'integer',
    ];

    /**
     * Get the employee that made the request.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Get the user who approved the request.
     */
    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Get the user who verified stock.
     */
    public function stockVerifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'stock_verified_by');
    }

    /**
     * Get the pickup record for this request.
     */
    public function pickup(): HasOne
    {
        return $this->hasOne(GallonPickup::class);
    }

    /**
     * Check if request can be approved.
     *
     * @return bool
     */
    public function canBeApproved(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if stock can be verified.
     *
     * @return bool
     */
    public function canVerifyStock(): bool
    {
        return $this->status === 'approved';
    }

    /**
     * Check if request can be completed (picked up).
     *
     * @return bool
     */
    public function canBeCompleted(): bool
    {
        return $this->status === 'verified_stock';
    }
}