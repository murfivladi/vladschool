<?php
// VladSchool Admin Panel — login semplificato (da proteggere in produzione con sessione)
declare(strict_types=1);
require __DIR__ . '/../src/Config.php';
require __DIR__ . '/../src/Db.php';
require __DIR__ . '/../src/Auth.php';

$config = new Config();
$db = new Db($config);
$auth = new Auth($db, $config);

$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $pass = $_POST['password'] ?? '';
    $res = $auth->login($email, $pass);
    if ($res['ok'] && ($res['user']['role'] ?? '') === 'admin') {
        $_SESSION['admin'] = true;
        header('Location: dashboard.php');
        exit;
    }
    $message = $res['error'] ?? 'Accesso negato';
}
?>
<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>VladSchool Admin</title>
<style>
body{font-family:system-ui,sans-serif;background:#0f172a;color:#f1f5f9;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}
.card{background:#1e293b;border:1px solid #334155;padding:32px;border-radius:16px;width:100%;max-width:360px;box-shadow:0 20px 40px rgba(0,0,0,0.4)}
h2{margin-top:0;margin-bottom:20px;font-size:1.25rem}
label{display:block;font-size:0.85rem;font-weight:700;color:#94a3b8;margin-bottom:6px}
input{width:100%;padding:10px;border-radius:10px;border:1px solid #334155;background:#0f172a;color:#f1f5f9;margin-bottom:16px}
input:focus{outline:none;border-color:#FF7A00}
button{width:100%;padding:10px;border:none;border-radius:10px;background:#FF7A00;color:#fff;font-weight:700;cursor:pointer}
button:hover{background:#E66A00}
.msg{color:#f87171;font-size:0.85rem;margin-bottom:12px}
a{color:#FF7A00;text-decoration:none;font-size:0.85rem;display:block;margin-top:16px;text-align:center}
</style>
</head>
<body>
<div class="card">
  <h2>🦇 VladSchool Admin</h2>
  <?php if ($message): ?><div class="msg"><?= htmlspecialchars($message) ?></div><?php endif; ?>
  <form method="post">
    <label>Email</label><input type="email" name="email" required placeholder="admin@vladschool.it">
    <label>Password</label><input type="password" name="password" required>
    <button type="submit">Entra</button>
  </form>
  <a href="/">← Torna al sito</a>
</div>
</body>
</html>
