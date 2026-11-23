<?php

namespace App\Models\Vendor;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    protected $fillable = [
        'user_id', 'shop_name', 'slug', 'owner_name', 'logo', 'banner', 'description',
        'email', 'phone', 'address', 'city', 'state', 'pincode', 'country',
        'pan', 'gst', 'adhar_number', 'bank_acount', 'bank_ifsc', 'bank_holder_name',
        'cancelled_checque', 'return_policy', 'shipping_policy',
        'business_hours', 'is_vacation_mode', 'status', 'rejection_reason',
    ];

    protected $casts = [
        'business_hours'   => 'array',
        'is_vacation_mode' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Frontend ko jo nested shape chahiye, wahi yahan se milegi
    public function toStoreArray(): array
    {
        return [
            'id'          => $this->id,
            'store_name'  => $this->shop_name,
            'logo'        => $this->logo ? asset('storage/' . $this->logo) : null,
            'banner'      => $this->banner ? asset('storage/' . $this->banner) : null,
            'description' => $this->description,
            'contact_details' => [
                'phone' => $this->phone,
                'email' => $this->email,
            ],
            'pickup_address' => [
                'address' => $this->address,
                'city'    => $this->city,
                'state'   => $this->state,
                'pincode' => $this->pincode,
                'country' => $this->country,
            ],
            'policies' => [
                'return_policy'   => $this->return_policy,
                'shipping_policy' => $this->shipping_policy,
            ],
            'business_hours'     => $this->business_hours,
            'is_vacation_mode'   => $this->is_vacation_mode,
            'public_preview_url' => $this->slug ? url('/stores/' . $this->slug) : null,
        ];
    }
}