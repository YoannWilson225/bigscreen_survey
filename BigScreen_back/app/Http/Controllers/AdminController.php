<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Answer;
use App\Models\Question;
use Illuminate\Http\Request;
use App\Models\PersonalAccessToken;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;

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


        /**
     * Connecte un nouvel utilisateur
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        // On essaie de vérifier les données fournies par la requête
        // En cas d'erreur on la récupère et on retourne cette erreur
        try {
            $request->validate([
                "email" => "required|email:rfc",
                "password" => "required|string",
            ]);
        }
        catch (\Exception $e) {
            $error = $e->getMessage();
            return response()->json([
                                        'error' => $error,
                                        'status' => 'failed'
                                    ], 202);
        }

        // Tentative de récupération de l'utilsateur
        // A partir de l'email fourni par la requête
        $admin = User::where(['email' => $request->email])->first();

        // Si une instance nulle est retournée
        if (!$admin) {
            return response()->json([
                                        'error' => 'Adresse email inconnue',
                                        'status' => 'failed'
                                    ], 202);
        }

        // On vérifie le mot de passe de la requête
// En cas d'erreur de correspondance, on renvoie l'erreur
if (!Hash::check($request->password, $admin->password)) {
    return response()->json([
        'error' => 'Identifiants invalides',
        'status' => 'failed'
    ], 202);
}


        // Si tout se passe bien, on créé le token
        $adminToken = $admin->createToken("token",  ['*'], now()->addHours(15))->plainTextToken;

        // La reponse est retounée
        return response()->json([
                                    'error' => '',
                                    'token' => $adminToken,
                                    'adminId' => $admin->id,
                                    'message' => "Connexion reussie",
                                    'status' => 'done'
                                ], 200);
    }


    /**
     * Déconnecte un utilisateur
     *
     * @param  int  $id
     * @param  string  $token
     * @return \Illuminate\Http\Response
     */
    public function logout($id = null, $token = null)
    {
        // On essaie de retrouver l'utilisateur à partir de son id
        // En cas d'erreur on la récupère et on retourne cette erreur
        try {
            $admin = User::findOrFail($id);
        } catch (\Exception $e) {
            return response()->json([
                                        'error' => $e->getMessage(),
                                        'status' => 'failed'
                                    ], 202);
        }

        // Si tout se passe bien
        // On supprime tous les tokens
        $admin->tokens()->delete();

        // La reponse est retounée
        return response()->json([
                                    'error' => '',
                                    'message' => "Deconnexion reussie",
                                    'status' => 'done'
                                ], 200);
    }

    /**
     * Vérifie si l'utilisateur est connecté
     *
     * @param  string  $token
     * @return \Illuminate\Http\Response
     */
    public function logged($token = null)
    {
        // On essaie de retrouver controler le token
        // En cas d'erreur on la récupère et on retourne cette erreur
        try {
            $isTokenChecked = PersonalAccessToken::checkToken($token);
        }
        catch (\Exception $e) {
            return response()->json([
                                        'error' => $e->getMessage(),
                                        'status' => 'failed'
                                    ], 202);
        }

        // La reponse est retounée si le token est valide
        // Dans le cas contraire le middleware prendre le relais
        if ($isTokenChecked) {
            return response()->json([
                                        'error' => '',
                                        'message' => "Utilisateur connecte",
                                        'token' => $token,
                                        'status' => 'done'
                                    ], 200);
        }
    }
}
