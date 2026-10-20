<?php
// VladSchool Auth — registrazione/login con password_hash, sessioni

declare(strict_types=1);

class Auth {
    public function __construct(
        private Db $db,
        private Config $config
    ) {}

    public function register(string $email, string $password): array {
        if ($email === '' || $password === '') {
            return ['ok' => false, 'error' => 'Email e password richieste'];
        }
        $pdo = $this->db->connect();
        $stmt = $pdo->prepare("SELECT id FROM " . $this->db->table('users') . " WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            return ['ok' => false, 'error' => 'Email già registrata'];
        }
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO " . $this->db->table('users') . " (email, password_hash, created_at) VALUES (?, ?, NOW())");
        $stmt->execute([$email, $hash]);
        $id = (int) $pdo->lastInsertId();
        $this->setSession($id);
        return ['ok' => true, 'user' => ['id' => $id, 'email' => $email, 'role' => 'studente']];
    }

    public function login(string $email, string $password): array {
        if ($email === '' || $password === '') {
            return ['ok' => false, 'error' => 'Email e password richieste'];
        }
        $pdo = $this->db->connect();
        $stmt = $pdo->prepare("SELECT id, email, password_hash, role FROM " . $this->db->table('users') . " WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        if (!$user || !password_verify($password, $user['password_hash'])) {
            return ['ok' => false, 'error' => 'Credenziali non valide'];
        }
        $this->setSession((int) $user['id']);
        return [
            'ok' => true,
            'user' => ['id' => (int) $user['id'], 'email' => $user['email'], 'role' => $user['role'] ?? 'studente'],
        ];
    }

    public function logout(): array {
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
        }
        session_destroy();
        return ['ok' => true];
    }

    public function me(): array {
        $id = $this->userId();
        if (!$id) return ['ok' => false, 'error' => 'Non autenticato'];
        $pdo = $this->db->connect();
        $stmt = $pdo->prepare("SELECT id, email, role FROM " . $this->db->table('users') . " WHERE id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch();
        if (!$user) return ['ok' => false, 'error' => 'Utente non trovato'];
        return ['ok' => true, 'user' => $user];
    }

    public function userId(): ?int {
        if (session_status() === PHP_SESSION_NONE) session_start();
        return $_SESSION['user_id'] ?? null;
    }

    public function isAdmin(): bool {
        $id = $this->userId();
        if (!$id) return false;
        $pdo = $this->db->connect();
        $stmt = $pdo->prepare("SELECT role FROM " . $this->db->table('users') . " WHERE id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch();
        return $user && $user['role'] === 'admin';
    }

    private function setSession(int $id): void {
        if (session_status() === PHP_SESSION_NONE) session_start();
        $_SESSION['user_id'] = $id;
        $_SESSION['regenerated'] = true;
    }
}
