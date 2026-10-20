<?php
// VladSchool RateLimit — max richieste/ora per utente/IP

declare(strict_types=1);

class RateLimit {
    public function __construct(private Db $db, private Config $config) {}

    public function check(): void {
        $limit = (int) $this->config->get('RATE_LIMIT_HOURLY', 60);
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $id = $_SESSION['user_id'] ?? null;
        $key = $id ? "user:$id" : "ip:$ip";

        $pdo = $this->db->connect();
        try {
            $pdo->exec("CREATE TABLE IF NOT EXISTS " . $this->db->table('rate_limit') . " (
                `key` VARCHAR(120) PRIMARY KEY,
                count INT UNSIGNED NOT NULL DEFAULT 0,
                window_start INT UNSIGNED NOT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
        } catch (\Throwable $e) {
            return;
        }

        $now = (int) time();
        $windowStart = $now - ($now % 3600);

        $pdo->beginTransaction();
        $stmt = $pdo->prepare("SELECT count, window_start FROM " . $this->db->table('rate_limit') . " WHERE `key` = ? FOR UPDATE");
        $stmt->execute([$key]);
        $row = $stmt->fetch();

        if ($row && $row['window_start'] === $windowStart) {
            $newCount = (int) $row['count'] + 1;
            if ($newCount > $limit) {
                $pdo->rollBack();
                http_response_code(429);
                echo json_encode(['ok' => false, 'error' => 'Rate limit superato. Riprova tra un\'ora.'], JSON_UNESCAPED_UNICODE);
                exit;
            }
            $pdo->prepare("UPDATE " . $this->db->table('rate_limit') . " SET count = ? WHERE `key` = ?")->execute([$newCount, $key]);
        } else {
            $pdo->prepare("INSERT INTO " . $this->db->table('rate_limit') . " (`key`, count, window_start) VALUES (?, 1, ?)
                           ON DUPLICATE KEY UPDATE count = 1, window_start = ?")->execute([$key, $windowStart, $windowStart]);
        }
        $pdo->commit();
    }
}
