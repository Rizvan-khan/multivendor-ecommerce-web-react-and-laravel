<?php

namespace App\Http\Controllers\Admin;


use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Models\Admin\Category;
use App\Services\CategoryService;
use Illuminate\Http\JsonResponse;
use App\Traits\ApiResponse;

class CategoryController extends Controller
{
      use ApiResponse;

    protected CategoryService $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function index(): JsonResponse
    {
        try {
            $categories = $this->categoryService->getCategoryTree();
            return $this->successResponse($categories, 'Categories fetched successfully.');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to fetch categories.', 500);
        }
    }

    public function store(CategoryRequest $request): JsonResponse
    {
        try {
            $category = $this->categoryService->createCategory($request->validated());
            return $this->successResponse($category, 'Category created successfully.', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to create category: ' . $e->getMessage(), 500);
        }
    }

    public function update(CategoryRequest $request, Category $category): JsonResponse
    {
        try {
            $updatedCategory = $this->categoryService->updateCategory($category, $request->validated());
            return $this->successResponse($updatedCategory, 'Category updated successfully.');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update category.', 500);
        }
    }

    public function destroy(Category $category): JsonResponse
    {
        try {
            $this->categoryService->deleteCategory($category);
            return $this->successResponse(null, 'Category deleted successfully.');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete category.', 500);
        }
    }
}
