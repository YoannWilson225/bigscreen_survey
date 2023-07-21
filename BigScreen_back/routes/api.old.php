<?php

use App\Models\User;
use Illuminate\Http\Request;
use PhpParser\Node\Stmt\TryCatch;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\AdminResource;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('admin/login', function(Request $request) {
    try {

        $request->validate([
            'email' => 'required|email:rfc',
            'password' => 'required|string',
        ]);
    }
    catch(\Throwable $e) {
        $e->getMessage();
    }

    $admin = User::where('email', $request->email)->first();

    if ($admin && Hash::check($request->password, $admin->password)) {
        return response()->json([
            'status' => 'connected',
            'token' => $admin->createToken('token', ['*'], now()->addMinutes(10))->plainTextToken,
        ]);
    }
    else
        return response()->json(['status' => 'failed']);
});

Route::get('/login', function(){
    return ["info" => "Vous devez vous connecter"];
})->name('login');


