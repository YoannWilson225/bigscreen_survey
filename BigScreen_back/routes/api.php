<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\SurveyController;

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

Route::post('stats', [SurveyController::class, 'getSurveyStatistics']);
Route::post('qualitystats', [SurveyController::class, 'getQualityStatistics']);



Route::get('questions', [SurveyController::class, 'getQuestions']);
Route::post('answers', [SurveyController::class, 'storeAnswers']);
Route::get('/answers/show', [SurveyController::class, 'showAnswer']);

Route::post('admin/register', [AdminController::class, 'registerAdmin']);
Route::post('admin/login', [AdminController::class, 'login'])->name('login');
Route::post('admin/answers/get', [SurveyController::class, 'getSurveyAnswers']);


Route::middleware('auth:sanctum')->group(function () {

    Route::post('admin/logout', [AdminController::class, 'logout']);
    // Autres routes d'administration
});

