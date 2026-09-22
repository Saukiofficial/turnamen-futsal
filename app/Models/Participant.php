<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Crypt;

class Participant extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'nisn',
        'nik_encrypted',
        'nik_hash',
        'birth_place',
        'birth_date',
        'school_name',
    ];

    protected $casts = [
        'birth_date' => 'date',
    ];

    protected $appends = [
        'masked_nik',
    ];

    public function registrations(): HasMany
    {
        return $this->hasMany(Registration::class);
    }

    public function setNik(string $nik): void
    {
        $cleanNik = preg_replace('/\D/', '', $nik);
        $this->nik_encrypted = Crypt::encryptString($cleanNik);
        $this->nik_hash = hash('sha256', $cleanNik);
    }

    public function getDecryptedNik(): ?string
    {
        try {
            return $this->nik_encrypted ? Crypt::decryptString($this->nik_encrypted) : null;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function getMaskedNikAttribute(): string
    {
        $raw = $this->getDecryptedNik();
        if (! $raw || strlen($raw) < 8) {
            return '•••• •••• •••• ••••';
        }

        $prefix = substr($raw, 0, 4);
        $suffix = substr($raw, -4);

        return "{$prefix} •••• •••• {$suffix}";
    }

    public function getNikMaskedAttribute(): string
    {
        return $this->masked_nik;
    }

    public function getNikAttribute(): ?string
    {
        return $this->getDecryptedNik();
    }
}
