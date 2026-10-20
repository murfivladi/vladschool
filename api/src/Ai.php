<?php
// VladSchool Ai — proxy polza.ai con modello specifico per OGNI tool (non per categoria)

declare(strict_types=1);

class Ai {
    // Modello AI dedicato per ogni singolo tool
    private const MODELS = [
        'equazioni-1grado'     => 'gpt-4o',
        'equazioni-2grado'     => 'gpt-4o',
        'sistemi-equazioni'    => 'gpt-4o',
        'frazioni'             => 'gpt-4o-mini',
        'geometria'            => 'gpt-4o-mini',
        'pitagora'             => 'gpt-4o-mini',
        'tavola-periodica'     => 'gpt-4o-mini',
        'chimica'              => 'gpt-4o',
        'fisica'               => 'gpt-4o',
        'analisi-grammaticale' => 'gpt-4o',
        'coniugatore'          => 'gpt-4o-mini',
        'ortografia'           => 'gpt-4o-mini',
        'storia'               => 'gpt-4o-mini',
        'geografia'            => 'gpt-4o-mini',
        'inglese-verbi'        => 'gpt-4o-mini',
        'inglese-grammatica'   => 'gpt-4o-mini',
        'flashcard'            => 'gpt-4o-mini',
        'pomodoro'             => 'gpt-4o-mini',
        'media-voti'           => 'gpt-4o-mini',
        'orario'               => 'gpt-4o-mini',
        'quiz-tempo'           => 'gpt-4o-mini',
        'impiccato'            => 'gpt-4o-mini',
        'lavagna'              => 'gpt-4o-mini',
        'copertine'            => 'gpt-4o-mini',
    ];

    public function __construct(private Config $config) {}

    public function chat(string $tool, string $message, ?int $userId): array {
        $apiKey = $this->config->get('POLZA_API_KEY');
        $baseUrl = rtrim($this->config->get('POLZA_BASE_URL', 'https://api.polza.ai/v1'), '/');
        $model = self::MODELS[$tool] ?? 'gpt-4o-mini';

        if ($apiKey === '') {
            return ['ok' => false, 'error' => 'Chiave polza.ai non configurata sul server'];
        }

        try {
            $ch = curl_init($baseUrl . '/chat/completions');
            curl_setopt_array($ch, [
                CURLOPT_POST => true,
                CURLOPT_HTTPHEADER => [
                    'Authorization: Bearer ' . $apiKey,
                    'Content-Type: application/json',
                ],
                CURLOPT_POSTFIELDS => json_encode([
                    'model' => $model,
                    'messages' => [
                        ['role' => 'system', 'content' => 'Sei un tutor scolastico italiano. Rispondi in italiano semplice, passo-passo, come se spiegassi a scuola.'],
                        ['role' => 'user', 'content' => $message],
                    ],
                    'stream' => false,
                ]),
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT => 60,
            ]);
            $resp = curl_exec($ch);
            $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($resp === false) {
                return ['ok' => false, 'error' => 'Errore di connessione a polza.ai'];
            }
            $data = json_decode($resp, true);
            if ($http >= 400 || !$data) {
                return ['ok' => false, 'error' => 'Risposta AI non valida (' . $http . ')'];
            }
            $text = $data['choices'][0]['message']['content'] ?? 'Nessuna risposta.';

            return ['ok' => true, 'model' => $model, 'text' => $text];
        } catch (\Throwable $e) {
            return ['ok' => false, 'error' => 'Errore interno: ' . $e->getMessage()];
        }
    }

    public function test(string $model, string $prompt): array {
        return $this->chat('admin-test', $prompt, null);
    }

    public static function modelForTool(string $tool): string {
        return self::MODELS[$tool] ?? 'gpt-4o-mini';
    }

    public static function allModels(): array {
        return self::MODELS;
    }
}
