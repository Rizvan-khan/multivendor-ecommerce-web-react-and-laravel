<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;

use App\Http\Requests\vendor\StoreProfileRequest;
use App\Http\Resources\vendor\StoreProfileResource;
use App\Services\StoreProfileService;
use Illuminate\Http\JsonResponse;
use App\Traits\ApiResponse;
use Illuminate\Validation\ValidationException;
use Exception;

class StoreProfileController extends Controller
{

    use ApiResponse;
    protected $storeService;

    public function __construct(StoreProfileService $storeService)
    {
        $this->storeService = $storeService;
    }

    public function show(): JsonResponse
    {
        try {
            $user = auth()->user();
            $store = $this->storeService->getStoreByUserId($user->id);
            $responseData = [
                'store' => new StoreProfileResource($store)
            ];

            $message = 'Store profile fetched successfully.';

            return $this->successResponse($responseData, $message);
        } catch (Exception $e) {
            return $this->errorResponse('Failed to fetch store profile internally.', 500);
        }
    }

    public function update(StoreProfileRequest $request): JsonResponse
    {
        try {
            $user = auth()->user();

            // Service layer me business logic (image upload, update/create) handle hogi
            $store = $this->storeService->updateOrCreateStore($user->id, $request->validated());

            $responseData = [
                'store' => new StoreProfileResource($store)
            ];

            $message = 'Store profile updated successfully.';

            return $this->successResponse($responseData, $message);
        } catch (ValidationException $e) {
            return $this->errorResponse($e->errors(), 422); // Proper mapping of form field errors
        } catch (Exception $e) {
            return $this->errorResponse('Failed to update store profile internally.', 500);
        }
    }
}
