<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $response = [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'role' => $this->role,
            'created_at' => $this->created_at->toIso8601String(),
        ];

        if ($this->role === 'vendor') {
            $response['vendor_meta'] = [
                'has_store' => $this->relationLoaded('vendor') && $this->vendor ? true : false, 
                'store_details' => $this->whenLoaded('vendor', function () {
                    return new VendorResource($this->vendor);
                }),
            ];
        }

        return $response;
    }
}
