<?php
// VladSchool API — front controller / router
// Path pubblico: https://vladinc.ru/school/api

declare(strict_types=1);

error_reporting(E_ALL);
ini_set('display_errors', '0'); // produzione: errori nei log, mai a video
ini_set('log_errors', '1');

header('Content-Type: application/json; charset=utf-8');

// Carica .env se presente (non nel repo)
function loadEnv(string $path): void {
    if (!is_file($path)) return;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) continue;
        if (!str_contains($line, '=')) continue;
        [$key, $val] = explode('=', $line, 2);
        $key = trim($key);
        $val = trim($val, "\"'");
        if (!array_key_exists($key, $_ENV)) {
            $_ENV[$key] = $val;
            $_SERVER[$key] = $val;
        }
    }
}

loadEnv(__DIR__ . '/.env');

require __DIR__ . '/src/Config.php';
require __DIR__ . '/src/Db.php';
require __DIR__ . '/src/Auth.php';
require __DIR__ . '/src/RateLimit.php';
require __DIR__ . '/src/Ai.php';
require __DIR__ . '/src/Models.php';
require __DIR__ . '/src/Sync.php';
require __DIR__ . '/src/Content.php';
require __DIR__ . '/src/Log.php';

$config = new Config();
$db = new Db($config);
$auth = new Auth($db, $config);
$rate = new RateLimit($db, $config);
$ai = new Ai($config);
$models = new Models($config);
$sync = new Sync($db, $config);
$content = new Content($db, $config);
$log = new Log($db, $config);

// ---- Helper ----

function sendJson(int $code, array $data): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function getMethod(): string {
    return $_SERVER['REQUEST_METHOD'] ?? 'GET';
}

function getPath(): string {
    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
    $base = rtrim(dirname($_SERVER['SCRIPT_NAME'] ?? ''), '/');
    $path = str_starts_with($uri, $base) ? substr($uri, strlen($base)) : $uri;
    return trim($path, '/');
}

function getBody(): array {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    return is_array($data) ? $data : [];
}

// ---- CORS preflight ----
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = $config->get('ALLOWED_ORIGIN', '*');
if ($allowed !== '*' && $origin !== $allowed) {
    // se non corrisponde, usa comunque l'origine richiesta per semplicità su shared hosting
    $allowed = $origin;
}
if ($allowed !== '*') {
    header("Access-Control-Allow-Origin: $allowed");
    header('Vary: Origin');
}
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if (getMethod() === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ---- Routing ----
$method = getMethod();
$path = getPath();
$segments = $path === '' ? [] : explode('/', $path);

// root
if ($path === '') {
    sendJson(200, ['name' => 'VladSchool API', 'version' => '1.0.0', 'status' => 'ok']);
}

// /auth/*
if ($segments[0] === 'auth') {
    $action = $segments[1] ?? '';
    if ($method === 'POST' && $action === 'register') {
        $d = getBody();
        sendJson(201, $auth->register($d['email'] ?? '', $d['password'] ?? ''));
    }
    if ($method === 'POST' && $action === 'login') {
        $d = getBody();
        sendJson(200, $auth->login($d['email'] ?? '', $d['password'] ?? ''));
    }
    if ($method === 'POST' && $action === 'logout') {
        sendJson(200, $auth->logout());
    }
    if ($method === 'GET' && $action === 'me') {
        sendJson(200, $auth->me());
    }
    sendJson(405, ['error' => 'endpoint auth non valido']);
}

// /ai/chat (streaming SSE)
if ($method === 'POST' && $segments[0] === 'ai' && ($segments[1] ?? '') === 'chat') {
    $rate->check(); // rate limit
    $d = getBody();
    $tool = $d['tool'] ?? 'tutor';
    $message = $d['message'] ?? '';
    sendJson(200, $ai->chat($tool, $message, $auth->userId()));
}

// /ai/models
if ($method === 'GET' && $segments[0] === 'ai' && ($segments[1] ?? '') === 'models') {
    sendJson(200, $models->list());
}

// /sync
if ($segments[0] === 'sync') {
    if ($method === 'GET')   sendJson(200, $sync->get($auth->userId()));
    if ($method === 'PUT')   sendJson(200, $sync->put($auth->userId(), getBody()));
    sendJson(405, ['error' => 'metodo non consentito su /sync']);
}

// /content
if ($segments[0] === 'content') {
    if ($method === 'GET')   sendJson(200, $content->get($segments[1] ?? null));
    if ($method === 'POST')  sendJson(200, $content->create(getBody(), $auth->userId()));
    sendJson(405, ['error' => 'metodo non consentito su /content']);
}

// /admin/* (protetto)
if ($segments[0] === 'admin') {
    if (!$auth->isAdmin()) sendJson(403, ['error' => 'admin richiesto']);
    $target = $segments[1] ?? '';
    if ($method === 'GET' && $target === 'config')   sendJson(200, $config->all());
    if ($method === 'POST' && $target === 'test-ai') sendJson(200, $ai->test(getBody()['model'] ?? '', getBody()['prompt'] ?? 'Ciao'));
    if ($method === 'GET' && $target === 'logs')     sendJson(200, $log->list());
    sendJson(404, ['error' => 'endpoint admin non trovato']);
}

// /feedback
if ($method === 'POST' && $segments[0] === 'feedback') {
    sendJson(200, ['ok' => true, 'msg' => 'Feedback ricevuto']);
}

// default 404
sendJson(404, ['error' => 'endpoint non trovato', 'path' => $path]);
