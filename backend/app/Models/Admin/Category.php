<?php

namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'parent_id',
        'commission_rate',
        'tax_rate',
    ];

    // Parent Category (Agar ye sub-category hai)
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    // Sub-categories (Children)
    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    // Recursive relationship taaki poora tree (Category -> Sub -> Sub-sub) ek baar mein load ho sake
    public function recursiveChildren()
    {
        return $this->hasMany(Category::class, 'parent_id')->with('recursiveChildren');
    }
}
