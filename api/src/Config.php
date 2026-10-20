<?php
// VladSchool Config — lettura variabili d'ambiente da .env

declare(strict_types=1);

class Config {
    private array $data = [];

    public function __construct() {
        $defaults = [
            'DB_HOST' => 'localhost',
            'DB_NAME' => 'vladschool',
            'DB_USER' => '',
            'DB_PASS' => '',
            'DB_TABLE_PREFIX' => 'vs_',
            'POLZA_API_KEY' => '',
            'POLZA_BASE_URL' => 'https://api.polza.ai/v1',
            'ADMIN_USER' => 'admin',
            'ADMIN_PASS_HASH' => '',
            'RATE_LIMIT_HOURLY' => '60',
            'ALLOWED_ORIGIN' => '*',
        ];
        foreach ($defaults as $key => $def) {
            $this->data[$key] = $_ENV[$key] ?? $_SERVER[$key] ?? $def;
        }
    }

    public function get(string $key, mixed $default = null): mixed {
        return $this->data[$key] ?? $default;
    }

    public function all(): array {
        $out = $this->data;
        unset($out['DB_PASS'], $out['POLZA_API_KEY'], $out['ADMIN_PASS_HASH']);
        return $out;
    }

    public function dsn(): string {
        return 'mysql:host=' . $this->get('DB_HOST') . ';dbname=' . $this->get('DB_NAME') . ';charset=utf8mb4';
    }
}
