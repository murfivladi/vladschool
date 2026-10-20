<?php
// VladSchool Sync — backup/sync dati account (JSON)

declare(strict_types=1);

class Sync {
    public function __construct(private Db $db, private Config $config) {}

    public function get(?int $userId): array {
        if (!$userId) return ['ok' => false, 'error' => 'Non autenticato'];
        $pdo = $this->db->connect();
        try {
            $pdo->exec("CREATE TABLE IF NOT EXISTS " . $this->db->table('sync') . " (
                user_id INT UNSIGNED PRIMARY KEY,
                data JSON NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
        } catch (\Throwable $e) {
            return ['ok' => false, 'error' => 'Tabella sync non disponibile'];
        }
        $stmt = $pdo->prepare("SELECT data FROM " . $this->db->table('sync') . " WHERE user_id = ?");
        $stmt->execute([$userId]);
        $row = $stmt->fetch();
        if (!$row) return ['ok' => true, 'data' => null];
        return ['ok' => true, 'data' => json_decode($row['data'], true)];
    }

    public function put(?int $userId, array $payload): array {
        if (!$userId) return ['ok' => false, 'error' => 'Non autenticato'];
        $pdo = $this->db->connect();
        try {
            $pdo->exec("CREATE TABLE IF NOT EXISTS " . $this->db->table('sync') . " (
                user_id INT UNSIGNED PRIMARY KEY,
                data JSON NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
        } catch (\Throwable $e) {
            return ['ok' => false, 'error' => 'Tabella sync non disponibile'];
        }
        $json = json_encode($payload ?? [], JSON_UNESCAPED_UNICODE);
        $pdo->prepare("INSERT INTO " . $this->db->table('sync') . " (user_id, data) VALUES (?, ?)
                       ON DUPLICATE KEY UPDATE data = VALUES(data), updated_at = CURRENT_TIMESTAMP")
            ->execute([$userId, $json]);
        return ['ok' => true];
    }
}
