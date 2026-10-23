<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VendorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'shop_name' => $this->shop_name,
            'owner_name' => $this->owner_name,
            'pan' => $this->pan,
            'gst' => $this->gst,
            'adhar_number' => $this->adhar_number,
            'bank_acount' => $this->bank_acount, // Aapki database spelling ke hisab se 'bank_acount'
            'cancelled_checque' => $this->cancelled_checque, // File/Image URL logic yahan add kar sakte hain
            'status' => $this->status,
            'rejection_reason' => $this->rejection_reason,
            'created_at' => $this->created_at ? $this->created_at->toIso8601String() : null,
        ];
    }
}
