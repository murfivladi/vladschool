<?php
// VladSchool Content — contenuti didattici e quiz (admin gestisce)

declare(strict_types=1);

class Content {
    public function __construct(private Db $db, private Config $config) {}

    public function get(?string $slug = null): array {
        $pdo = $this->db->connect();
        try {
            $pdo->exec("CREATE TABLE IF NOT EXISTS " . $this->db->table('content') . " (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                slug VARCHAR(120) NOT NULL UNIQUE,
                title VARCHAR(200) NOT NULL,
                body JSON NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
        } catch (\Throwable $e) {
            return ['ok' => false, 'error' => 'Tabella content non disponibile'];
        }
        if ($slug === null) {
            $stmt = $pdo->query("SELECT id, slug, title, created_at FROM " . $this->db->table('content'));
            return ['ok' => true, 'items' => $stmt->fetchAll()];
        }
        $stmt = $pdo->prepare("SELECT * FROM " . $this->db->table('content') . " WHERE slug = ?");
        $stmt->execute([$slug]);
        $row = $stmt->fetch();
        if (!$row) return ['ok' => false, 'error' => 'Contenuto non trovato'];
        return ['ok' => true, 'item' => $row];
    }

    public function create(array $data, ?int $userId): array {
        if (!$userId) return ['ok' => false, 'error' => 'Non autenticato'];
        if (empty($data['slug']) || empty($data['title'])) {
            return ['ok' => false, 'error' => 'slug e title richiesti'];
        }
        $pdo = $this->db->connect();
        $stmt = $pdo->prepare("INSERT INTO " . $this->db->table('content') . " (slug, title, body) VALUES (?, ?, ?)");
        $stmt->execute([$data['slug'], $data['title'], json_encode($data['body'] ?? [], JSON_UNESCAPED_UNICODE)]);
        return ['ok' => true, 'id' => (int) $pdo->lastInsertId()];
    }
}
