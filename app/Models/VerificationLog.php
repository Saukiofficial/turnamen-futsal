<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VerificationLog extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'registration_id',
        'admin_id',
        'previous_status',
        'new_status',
        'checklist_json',
        'note',
        'created_at',
    ];

    protected $casts = [
        'checklist_json' => 'array',
        'created_at' => 'datetime',
    ];

    public function registration(): BelongsTo
    {
        return $this->belongsTo(Registration::class);
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}
