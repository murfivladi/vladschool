<?php
// VladSchool Log — log richieste AI per admin panel

declare(strict_types=1);

class Log {
    public function __construct(private Db $db, private Config $config) {}

    public function list(): array {
        $pdo = $this->db->connect();
        try {
            $pdo->exec("CREATE TABLE IF NOT EXISTS " . $this->db->table('ai_log') . " (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                tool VARCHAR(60) NOT NULL,
                model VARCHAR(120) NOT NULL,
                user_id INT UNSIGNED NULL,
                ok TINYINT(1) NOT NULL,
                error TEXT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
        } catch (\Throwable $e) {
            return ['ok' => false, 'error' => 'Tabella log non disponibile', 'items' => []];
        }
        $stmt = $pdo->query("SELECT * FROM " . $this->db->table('ai_log') . " ORDER BY created_at DESC LIMIT 100");
        return ['ok' => true, 'items' => $stmt->fetchAll()];
    }

    public function add(string $tool, string $model, ?int $userId, bool $ok, ?string $error = null): void {
        try {
            $pdo = $this->db->connect();
            $this->list(); // crea tabella se serve
            $stmt = $pdo->prepare("INSERT INTO " . $this->db->table('ai_log') . " (tool, model, user_id, ok, error) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$tool, $model, $userId, $ok ? 1 : 0, $error]);
        } catch (\Throwable $e) {
            error_log("[VladSchool Log] " . $e->getMessage());
        }
    }
}
