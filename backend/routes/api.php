<?php

use App\Http\Controllers\Auth\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



Route::post('/login', [AuthController::class, 'login']);

// Route::middleware(['auth:sanctum', 'ability:vendor'])->group(function () {
//     Route::post('/vendor/products', [VendorProductController::class, 'store']);
// });

// // Only for Users
// Route::middleware(['auth:sanctum', 'ability:user'])->group(function () {
//     Route::post('/user/orders', [OrderController::class, 'store']);
// });
