<?php namespace App\Services;

use App\Models\Admin\Category;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class CategoryService
{
    protected string $cacheKey = 'app_categories_tree';

    // 1. Get Tree with Caching
 public function getCategoryTree()
    {
        return Cache::remember($this->cacheKey, now()->addHours(24), function () {
            return Category::whereNull('parent_id')
                ->with(['recursiveChildren'])
                ->get()
                ->toArray(); // <-- Yeh addition zaroori hai!
        });
    }

    // 2. Create Category & Clear Cache
   
    public function createCategory(array $data): Category
    {
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $category = Category::create($data);
        
        // Jaise hi nayi category bane, cache flush kar do taaki nayi list dikhne lage
        Cache::forget($this->cacheKey);

        return $category;
    }

    // 3. Update Category & Clear Cache
    public function updateCategory(Category $category, array $data): Category
    {
        if (isset($data['name']) && empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $category->update($data);
        Cache::forget($this->cacheKey);

        return $category;
    }

    // 4. Delete Category & Clear Cache
    public function deleteCategory(Category $category): bool
    {
        $deleted = $category->delete();
        Cache::forget($this->cacheKey);

        return $deleted;
    }
}