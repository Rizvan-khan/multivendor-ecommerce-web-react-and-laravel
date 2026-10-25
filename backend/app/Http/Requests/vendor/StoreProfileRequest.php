<?php

namespace App\Http\Requests\Vendor;

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Ya check karein ki authenticated user vendor hai ya nahi
    }

    public function rules(): array
    {
        return [
            'store_name' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // 2MB max
            'banner' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096', // 4MB max
            'description' => 'nullable|string|max:1000',

            // Contact details & Pickup address
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'pincode' => 'required|string|max:10',
            'country'  => 'required|string|max:100',

            // Policies
            'return_policy' => 'nullable|string',
            'shipping_policy' => 'nullable|string',

            // Business hours & Vacation mode
            'business_hours' => 'nullable|array', // JSON format me store kar sakte hain
            'is_vacation_mode' => 'boolean',
        ];
    }
}
