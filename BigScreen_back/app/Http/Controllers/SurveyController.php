<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Option;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SurveyController extends Controller
{
    public function getQuestions()
    {
        $questions = Question::all();

        if ($questions->count() > 0) {
            $questionsData = [];

            foreach ($questions as $question) {
                $data = [
                    'id' => $question->id, // Ajoutez la propriété 'id' avec la valeur de l'ID de la question
                    'body' => $question->body,
                    'type' => $question->type,
                    'options' => []
                ];

                if ($question->type === 'A') {
                    $options = $question->options->pluck('value')->all();
                    $data['options'] = $options;
                }

                $questionsData[] = $data;
            }

            return response()->json([
                'status' => 200,
                'questions' => $questionsData
            ], 200);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'Pas de questions trouvées'
            ], 404);
        }
    }


    public function storeAnswers(Request $request)
    {
        $answers = $request->input('answers');
        
        $visitorId = uniqid(); // Génère une clé de référence alphanumérique unique

        // Vérifier la première question avant d'enregistrer les réponses
        if (!isset($answers[0]) || $answers[0]['question_id'] !== 1) {
            // Première question manquante ou invalide, renvoyer un message d'erreur
            return response()->json(['error' => 'La première question est manquante ou invalide.'], 400);
        }

        $firstQuestion = $answers[0];

        // Vérifier si la première question est une question de type "B" (e-mail)
        if ($firstQuestion['question_id'] === 1 && isset($firstQuestion['value']) && !empty($firstQuestion['value'])) {
            $validator = Validator::make($firstQuestion, [
                'value' => 'email', // Validation de l'e-mail
            ]);

            if ($validator->fails()) {
                // Première question invalide, renvoyer les erreurs de validation
                return response()->json(['error' => 'L\'e-mail n\'est pas valide.'], 400);
            }
        }

        foreach ($answers as $answerData) {
            $questionId = $answerData['question_id'];
            $response = $answerData['value']; // Utilise le champ "value" pour la réponse

            Answer::create([
                'question_id' => $questionId,
                'response' => $response, // Utilise le champ "value" pour la réponse
                'visitor_id' => $visitorId, // Associe la clé de référence au champ visitor_id
            ]);
        }

        return response()->json(['visitor_id' => $visitorId], 200);
    }



public function getSurveyAnswersByVisitorId($visitorId)
{
    // Récupérer toutes les réponses du sondage associées au visitor_id spécifié
    $responses = Answer::where('visitor_id', $visitorId)->get();

    if ($responses->count() > 0) {
        return response()->json([
            'status' => 200,
            'responses' => $responses
        ], 200);
    } else {
        return response()->json([
            'status' => 404,
            'message' => 'Aucune réponse trouvée pour le visitor_id spécifié'
        ], 404);
    }
}



    public function getSurveyAnswers()
    {
        // Récupérer toutes les réponses du sondage
        $responses = Answer::all();

        return response()->json([
            'status' => 200,
            'responses' => $responses
        ], 200);
    }


    public function getSurveyStatistics()
    {
        // Récupérer les réponses aux questions avec un question_id de 6 à 7
        $answers = Answer::whereIn('question_id', [6, 7, 10])->get();

        // Tableau pour stocker les résultats des réponses
        $results = [];

        // Parcourir les réponses et les regrouper par question_id
        foreach ($answers as $answer) {
            $questionId = $answer->question_id;
            $response = $answer->response;

            if (!isset($results[$questionId])) {
                $results[$questionId] = [];
            }

            // Compter les occurrences de chaque réponse
            if (isset($results[$questionId][$response])) {
                $results[$questionId][$response]++;
            } else {
                $results[$questionId][$response] = 1;
            }
        }

        // Préparer les données pour les graphiques
        $data = [];

        foreach ($results as $questionId => $responses) {
            $data[] = [
                'question_id' => $questionId,
                'responses' => $responses,
            ];
        }

        // Retourner les données adaptées pour les graphiques au format JSON
        return response()->json($data);
    }

    public function getQualityStatistics()
    {
        // Récupérer les réponses aux questions avec un question_id de 11 à 15
        $answers = Answer::whereIn('question_id', [11,12,13,14,15])->get();

        // Tableau pour stocker les résultats des réponses
        $results = [];

        // Parcourir les réponses et les regrouper par question_id
        foreach ($answers as $answer) {
            $questionId = $answer->question_id;
            $response = $answer->response;

            if (!isset($results[$questionId])) {
                $results[$questionId] = [];
            }

            // Compter les occurrences de chaque réponse
            if (isset($results[$questionId][$response])) {
                $results[$questionId][$response]++;
            } else {
                $results[$questionId][$response] = 1;
            }
        }

        // Préparer les données pour les graphiques
        $data = [];

        foreach ($results as $questionId => $responses) {
            $data[] = [
                'question_id' => $questionId,
                'responses' => $responses,
            ];
        }

        // Retourner les données adaptées pour les graphiques au format JSON
        return response()->json($data);
    }
}
