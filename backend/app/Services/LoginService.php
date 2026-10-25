<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class LoginService
{
    public function authenticate(array $credentials): array
    {
        $user = User::where('email', $credentials['email'])->first();

        // 1. Password Verification
        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        // 2. Role Verification (Agar request me targeted role bheja gaya ho)
        // if (isset($credentials['role']) && $user->role !== $credentials['role']) {
        //     throw ValidationException::withMessages([
        //         'role' => ["You do not have access rights as a {$credentials['role']}"],
        //     ]);
        // }


        $token = $user->createToken('auth_token', [$user->role])->plainTextToken;
        if ($user->role === 'vendor') {
            $user->load('vendor');
        }
        return [
            'user' => $user,
            'token' => $token,
            'role' => $user->role // Returning active role
        ];
    }
}
