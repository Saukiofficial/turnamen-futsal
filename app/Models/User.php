<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
        'phone',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'last_login_at' => 'datetime',
        ];
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin';
    }

    public function isAdmin(): bool
    {
        return in_array($this->role, ['super_admin', 'admin_pendaftaran']);
    }

    public function isVerifikator(): bool
    {
        return in_array($this->role, ['super_admin', 'admin_pendaftaran', 'verifikator']);
    }

    public function isPelatih(): bool
    {
        return in_array($this->role, ['super_admin', 'pelatih']);
    }

    public function isCheckinOfficer(): bool
    {
        return in_array($this->role, ['super_admin', 'admin_pendaftaran', 'checkin_officer']);
    }
}
