<?php
// VladSchool Models — proxy lista modelli polza.ai /v1/models

declare(strict_types=1);

class Models {
    public function __construct(private Config $config) {}

    public function list(): array {
        $apiKey = $this->config->get('POLZA_API_KEY');
        $baseUrl = rtrim($this->config->get('POLZA_BASE_URL', 'https://api.polza.ai/v1'), '/');

        if ($apiKey === '') {
            return ['ok' => false, 'error' => 'Chiave polza.ai non configurata', 'models' => []];
        }

        try {
            $ch = curl_init($baseUrl . '/models');
            curl_setopt_array($ch, [
                CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $apiKey],
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT => 30,
            ]);
            $resp = curl_exec($ch);
            $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($resp === false || $http >= 400) {
                return ['ok' => false, 'error' => 'Impossibile caricare modelli (' . $http . ')', 'models' => []];
            }
            $data = json_decode($resp, true);
            $models = [];
            foreach (($data['data'] ?? []) as $m) {
                $models[] = $m['id'] ?? $m;
            }
            return ['ok' => true, 'models' => $models];
        } catch (\Throwable $e) {
            return ['ok' => false, 'error' => $e->getMessage(), 'models' => []];
        }
    }
}
