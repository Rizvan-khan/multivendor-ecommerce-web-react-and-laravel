<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Vendor\StoreProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



Route::post('/login', [AuthController::class, 'login']);


// vendor login details {
//     "email": "vandervort.nicole@example.org",
//     "password": "password",
//     "role": "vendor"
// }

// user email : noemie.bartell@example.net",

Route::middleware('auth:sanctum')->prefix('vendor')->group(function () {
    Route::get('/profile', [AuthController::class, 'vendorshowprofile']);
    Route::get('/store/profile', [StoreProfileController::class, 'show']);
    Route::post('/store/profile', [StoreProfileController::class, 'update']);

});

// // Only for Users
// Route::middleware(['auth:sanctum', 'ability:user'])->group(function () {
//     Route::post('/user/orders', [OrderController::class, 'store']);
// });
