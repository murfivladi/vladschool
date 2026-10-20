<?php
// VladSchool Db — connessione MySQL (PDO) con prefisso tabelle da .env

declare(strict_types=1);

class Db {
    private ?\PDO $pdo = null;

    public function __construct(private Config $config) {}

    public function connect(): \PDO {
        if ($this->pdo === null) {
            $opts = [
                \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
                \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
                \PDO::ATTR_EMULATE_PREPARES => false,
            ];
            $this->pdo = new \PDO(
                $this->config->dsn(),
                $this->config->get('DB_USER'),
                $this->config->get('DB_PASS'),
                $opts
            );
        }
        return $this->pdo;
    }

    public function prefix(): string {
        return $this->config->get('DB_TABLE_PREFIX', 'vs_');
    }

    public function table(string $name): string {
        return $this->prefix() . $name;
    }
}
