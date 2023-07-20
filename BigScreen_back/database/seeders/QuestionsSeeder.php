<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use Illuminate\Database\Seeder;
use App\Models\Question;

class QuestionsSeeder extends Seeder
{
    public function run()
    {
        $questions = [
            [
                'body' => 'Votre adresse mail ?',
                'type' => 'B',
            ],
            [
                'body' => 'Votre âge ?',
                'type' => 'B',
            ],
            [
                'body' => 'Votre sexe ?',
                'type' => 'A',
                'options' => ['Homme', 'Femme', 'Préfère ne pas répondre'],
            ],
            [
                'body' => 'Nombre de personnes dans votre foyer (adulte & enfants – répondant inclus) ?',
                'type' => 'C',
            ],
            [
                'body' => 'Votre profession ?',
                'type' => 'B',
            ],
            [
                'body' => 'Quelle marque de casque VR utilisez-vous ?',
                'type' => 'A',
                'options' => ['Oculus Quest', 'Oculus Rift/s', 'HTC Vive', 'Windows Mixed Reality', 'Valve index'],
            ],
            [
                'body' => 'Sur quel magasin d’application achetez-vous des contenus VR ?',
                'type' => 'A',
                'options' => ['SteamVR', 'Occulus store', 'Viveport', 'Windows store'],
            ],
            [
                'body' => 'Quel casque envisagez-vous d’acheter dans un futur proche ?',
                'type' => 'A',
                'options' => ['Occulus Quest', 'Occulus Go', 'HTC Vive Pro', 'PSVR', 'Autre', 'Aucun'],
            ],
            [
                'body' => 'Au sein de votre foyer, combien de personnes utilisent votre casque VR pour regarder Bigscreen ?',
                'type' => 'C',
            ],
            [
                'body' => 'Vous utilisez principalement Bigscreen pour ….. ?',
                'type' => 'A',
                'options' => ['regarder la TV en direct', 'regarder des films', 'travailler', 'jouer en solo', 'jouer en équipe'],
            ],
            [
                'body' => 'Combien de points (de 1 à 5) donnez-vous à la qualité de l’image sur Bigscreen ?',
                'type' => 'C',
            ],
            [
                'body' => 'Combien de points (de 1 à 5) donnez-vous au confort d’utilisation de l’interface Bigscreen ?',
                'type' => 'C',
            ],
            [
                'body' => 'Combien de points (de 1 à 5) donnez-vous à la connexion réseau de Bigscreen ?',
                'type' => 'C',
            ],
            [
                'body' => 'Combien de points (de 1 à 5) donnez-vous à la qualité des graphismes 3D dans Bigscreen ?',
                'type' => 'C',
            ],
            [
                'body' => 'Combien de points (de 1 à 5) donnez-vous à la qualité audio dans Bigscreen ?',
                'type' => 'C',
            ],
            [
                'body' => 'Aimeriez-vous avoir des notifications plus précises au cours de vos sessions Bigscreen ?',
                'type' => 'A',
                'options' => ['Oui', 'Non'],
            ],
            [
                'body' => 'Aimeriez-vous pouvoir inviter un ami à rejoindre votre session via son smartphone ?',
                'type' => 'A',
                'options' => ['Oui', 'Non'],
            ],
            [
                'body' => 'Aimeriez-vous pouvoir enregistrer des émissions TV pour pouvoir les regarder ultérieurement ?',
                'type' => 'A',
                'options' => ['Oui', 'Non'],
            ],
            [
                'body' => 'Aimeriez-vous jouer à des jeux exclusifs sur votre Bigscreen ?',
                'type' => 'A',
                'options' => ['Oui', 'Non'],
            ],
            [
                'body' => 'Selon vous, quelle nouvelle fonctionnalité devrait exister sur Bigscreen ?',
                'type' => 'B',
            ],
        ];

        foreach ($questions as $question) {
            $createdQuestion = Question::create([
                'body' => $question['body'],
                'type' => $question['type'],
            ]);

            if (isset($question['options'])) {
                $options = $question['options'];
                $createdQuestion->options()->createMany(
                    array_map(function ($option) {
                        return ['value' => $option];
                    }, $options)
                );
            }
        }
    }
}

