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


Route::get('questions', [SurveyController::class, 'getQuestions']);
Route::post('answers', [SurveyController::class, 'storeAnswers']);
Route::get('/showAnswers/{visitorId}', [SurveyController::class, 'getSurveyAnswersByVisitorId']);

Route::post('admin/register', [AdminController::class, 'registerAdmin']);
Route::post('admin/login', [AdminController::class, 'login']);


Route::middleware('trusttoken')->group(function() {

    Route::post('admin/stats/{token?}', [SurveyController::class, 'getSurveyStatistics']);
    Route::post('admin/qualitystats/{token?}', [SurveyController::class, 'getQualityStatistics']);
    Route::get('admin/answers/get/{token?}', [SurveyController::class, 'getSurveyAnswers']);
    Route::get('admin/logged/{token?}',[AdminController::class, "logged"]);
    Route::post('admin/logout/{id}/{token?}', [AdminController::class, 'logout']);

});
