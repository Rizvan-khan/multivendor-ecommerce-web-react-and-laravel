<?php

namespace App\Services;

use App\Models\Vendor\Vendor;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class StoreProfileService
{

    public function getStoreByUserId(int $userId)
    {
        return Vendor::where('user_id', $userId)->firstOrFail();
    }

    public function updateOrCreateStore(int $userId, array $data)
    {
        // Check karein ki store pehle se exist karta hai ya nahi
        $store = Vendor::where('user_id', $userId)->first();

        // 1. Slug Generation (Agar shop_name update ho raha hai)
        if (isset($data['shop_name'])) {
            $baseSlug = Str::slug($data['shop_name']);
            $slug = $baseSlug;
            $counter = 1;

            // Unique slug check (current store ko chod kar)
            while (Vendor::where('slug', $slug)->when($store, function ($query) use ($store) {
                return $query->where('id', '!=', $store->id);
            })->exists()) {
                $slug = $baseSlug . '-' . $counter++;
            }
            $data['slug'] = $slug;
        }

        // 2. Logo Upload Handling
        if (request()->hasFile('logo')) {
            // Agar purana logo hai toh storage se delete kar do
            if ($store && $store->logo) {
                Storage::disk('public')->delete($store->logo);
            }
            // Naya logo 'storage/app/public/stores/logos' folder me save hoga
            $data['logo'] = request()->file('logo')->store('stores/logos', 'public');
        }

        // 3. Banner Upload Handling
        if (request()->hasFile('banner')) {
            if ($store && $store->banner) {
                Storage::disk('public')->delete($store->banner);
            }
            $data['banner'] = request()->file('banner')->store('stores/banners', 'public');
        }

        // 4. Database me Save ya Update karna
        if ($store) {
            $store->update($data);
            return $store;
        } else {
            $data['user_id'] = $userId;
            return Vendor::create($data);
        }
    }
}
