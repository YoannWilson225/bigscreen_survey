<?php

use App\Models\PersonalAccessToken;
use Illuminate\Support\Facades\Route;
use Illuminate\http\Request;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test', function (Request $request) {
    dd(PersonalAccessToken::checkToken('9|qFtGkfFLwCnBpDC8QvjEVyAxwfYo2bCSurQwEwuP'));
    return 'OK';
});
