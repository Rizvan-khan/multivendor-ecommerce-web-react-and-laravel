<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Vendor\StoreProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);



Route::middleware('auth:sanctum')->prefix('vendor')->group(function () {
    Route::get('/profile', [AuthController::class, 'vendorshowprofile']);
    Route::get('/store/profile', [StoreProfileController::class, 'show']);
    Route::post('/store/profile', [StoreProfileController::class, 'update']);
    Route::get('/categories', [CategoryController::class, 'index']);

});

// // Only for admin
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
   // Category Management Routes
    Route::apiResource('categories', CategoryController::class);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});
