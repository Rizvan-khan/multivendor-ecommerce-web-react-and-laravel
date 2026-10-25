<?php

namespace App\Http\Resources\vendor;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StoreProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'store_name' => $this->store_name,
            'logo' => $this->logo ? asset('storage/' . $this->logo) : null,
            'banner' => $this->banner ? asset('storage/' . $this->banner) : null,
            'description' => $this->description,
            'contact_details' => [
                'phone' => $this->phone,
                'email' => $this->email,
            ],
            'pickup_address' => [
                'address' => $this->address,
                'city' => $this->city,
                'state' => $this->state,
                'pincode' => $this->pincode,
                'country' => $this->country,
            ],
            'policies' => [
                'return_policy' => $this->return_policy,
                'shipping_policy' => $this->shipping_policy,
            ],
            'business_hours' => $this->business_hours,
            'is_vacation_mode' => (bool) $this->is_vacation_mode,
            'public_preview_url' => url('/stores/' . $this->slug), // Public page preview link
        ];
    }
}
