<?php

namespace App\Models\Vendor;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
   protected $fillable = ['user_id', 'shop_name', 'owner_name', 'pan', 'gst', 'adhar_number', 'bank_acount', 'cancelled_checque', 'status', 'rejection_reason'];

 public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

   }
