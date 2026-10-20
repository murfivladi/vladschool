<?php
// VladSchool Ai — proxy polza.ai con streaming SSE e mapping modello per tool

declare(strict_types=1);

class Ai {
    public function __construct(private Config $config) {}

    public function chat(string $tool, string $message, ?int $userId): array {
        $apiKey = $this->config->get('POLZA_API_KEY');
        $baseUrl = rtrim($this->config->get('POLZA_BASE_URL', 'https://api.polza.ai/v1'), '/');
        $model = $this->modelForTool($tool);

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

            // Log richiesta
            $this->log($tool, $model, $userId, true);

            return ['ok' => true, 'model' => $model, 'text' => $text];
        } catch (\Throwable $e) {
            $this->log($tool, $model, $userId, false, $e->getMessage());
            return ['ok' => false, 'error' => 'Errore interno: ' . $e->getMessage()];
        }
    }

    public function test(string $model, string $prompt): array {
        return $this->chat('admin-test', $prompt, null);
    }

    public function modelForTool(string $tool): string {
        $mapping = [
            'math' => 'gpt-4o-mini',
            'science' => 'gpt-4o-mini',
            'italian' => 'gpt-4o-mini',
            'history' => 'gpt-4o-mini',
            'english' => 'gpt-4o-mini',
            'study' => 'gpt-4o-mini',
            'tutor' => 'gpt-4o-mini',
        ];
        return $mapping[$tool] ?? 'gpt-4o-mini';
    }

    private function log(string $tool, string $model, ?int $userId, bool $ok, string $err = ''): void {
        // placeholder: in produzione scrivere su DB via Log class
        error_log("[VladSchool AI] tool=$tool model=$model user=" . ($userId ?? 'anon') . " ok=" . ($ok ? '1' : '0') . " err=$err");
    }
}
