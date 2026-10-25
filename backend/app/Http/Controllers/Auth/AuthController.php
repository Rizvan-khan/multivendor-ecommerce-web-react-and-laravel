<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Request\LoginRequest;
use App\Http\Resources\UserResource;
use App\Services\LoginService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use ApiResponse;

    protected LoginService $loginService;

    public function __construct(LoginService $loginService)
    {
        $this->loginService = $loginService;
    }

    public function login(LoginRequest $request): JsonResponse
    {
        try {
            // Business logic execution
            $result = $this->loginService->authenticate($request->validated());

            $responseData = [
                'user' => new UserResource($result['user']),
                'access_token' => $result['token'],
                'token_type' => 'Bearer'
            ];

            // Industry standard greeting based on role
            $message = ucfirst($result['role']) . ' logged in successfully.';

            return $this->successResponse($responseData, $message);
        } catch (ValidationException $e) {
            return $this->errorResponse($e->errors(), 422); // Proper mapping of form field errors
        } catch (\Exception $e) {
            return $this->errorResponse('Authentication failed process internally.', 500);
        }
    }

    public function vendorshowprofile(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'message' => 'Vendor profile fetched successfully',
            'user' => $user,
        ]);
    }
}
