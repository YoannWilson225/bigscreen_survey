<?php

namespace App\Http\Middleware;
use App\Models\PersonalAccessToken;
use Closure;
use Illuminate\Http\Request;

use Symfony\Component\HttpFoundation\Response;

class TrustToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // On vérifie si la route courante a un certain paramètre de route
        if ($request->route()->hasParameter("token")) {

            if (PersonalAccessToken::checkToken($request->route()->token)) {
                return $next($request);
            }
        }
        // Sinon on retourne un message d'erreur à l'utilisateur
        // Avec un code d'état HTTP 200
        return response()->json([
                                    'error' => '',
                                    "Message" => "token non valide",
                                    'status' => 'failed'
                                ], 200);
    }
}
