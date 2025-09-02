<?php
declare(strict_types=1);
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../vendor/autoload.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];
header('Content-Type: application/json; charset=utf-8');

if ($uri === '/api/auth/register' && $method === 'POST') {
    require_once __DIR__ . '/../src/controllers/AuthController.php';
    (new App\Controllers\AuthController())->register();
    exit();
}
if ($uri === '/api/auth/login' && $method === 'POST') {
    require_once __DIR__ . '/../src/controllers/AuthController.php';
    (new App\Controllers\AuthController())->login();
    exit();
}
if ($uri === '/api/auth/forgot-password' && $method === 'POST') {
    require_once __DIR__ . '/../src/controllers/AuthController.php';
    (new App\Controllers\AuthController())->forgotPassword();
    exit();
}
if ($uri === '/api/auth/reset-password' && $method === 'POST') {
    require_once __DIR__ . '/../src/controllers/AuthController.php';
    (new App\Controllers\AuthController())->resetPassword();
    exit();
}
if ($uri === '/api/user/me' && $method === 'GET') {
    require_once __DIR__ . '/../src/controllers/UserController.php';
    (new App\Controllers\UserController())->me();
    exit();
}

http_response_code(404);
echo json_encode(['error'=>'Route not found']);


if ($uri === '/api/library' && $method === 'GET') {
    require_once __DIR__ . '/../src/controllers/LibraryController.php';
    (new App\Controllers\LibraryController())->list();
    exit();
}
if (preg_match('#^/api/library/([0-9]+)$#', $uri, $m) && $method === 'GET') {
    require_once __DIR__ . '/../src/controllers/LibraryController.php';
    (new App\Controllers\LibraryController())->details((int)$m[1]);
    exit();
}
if (preg_match('#^/api/player/playlist/([0-9]+)$#', $uri, $m) && $method === 'GET') {
    require_once __DIR__ . '/../src/controllers/PlayerController.php';
    (new App\Controllers\PlayerController())->playlist((int)$m[1]);
    exit();
}
if ($uri === '/api/player/progress' && $method === 'POST') {
    require_once __DIR__ . '/../src/controllers/PlayerController.php';
    (new App\Controllers\PlayerController())->saveProgress();
    exit();
}
if ($uri === '/api/dashboard/overview' && $method === 'GET') {
    require_once __DIR__ . '/../src/controllers/DashboardController.php';
    (new App\Controllers\DashboardController())->overview();
    exit();
}
