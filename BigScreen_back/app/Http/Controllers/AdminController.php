<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\PersonalAccessToken;
use App\Http\Controllers\Controller;
use App\Models\User; // Ajouter cette ligne d'importation

class AdminController extends Controller
{

    public function registerAdmin(Request $request)
    {
        // Valider les données du formulaire (email, mot de passe, etc.)
        $validatedData = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
        ]);

        // Créer un nouvel utilisateur administrateur
        $admin = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => bcrypt($validatedData['password']), // Utilisation de bcrypt pour hacher le mot de passe
            'is_admin' => 1, // Définir la colonne 'is_admin' sur 1 pour l'administrateur
        ]);

        // Gérer le succès de l'enregistrement de l'administrateur
        return response()->json(['message' => 'Nouvel administrateur enregistré avec succès']);
    }


    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = auth()->user();

            if ($user->isAdmin()) {

                // L'utilisateur est un administrateur
                // Générer un token d'authentification pour l'utilisateur
                $token = $user->createToken('auth-token')->plainTextToken;

                // Retourner le token d'authentification avec la réponse JSON
                return response()->json(['message' => 'Connexion réussie en tant qu\'administrateur', 'token' => $token]);
            }
        }

        // Identifiants invalides ou l'utilisateur n'est pas un administrateur
        // Gérer l'échec de la connexion de l'administrateur
        return response()->json(['message' => 'Identifiants invalides ou vous n\'êtes pas un administrateur'], 401);
    }



    public function logout()
    {
        Auth::logout();

        // Gérer la déconnexion de l'administrateur
        return response()->json(['message' => 'Déconnexion réussie']);
    }
}
