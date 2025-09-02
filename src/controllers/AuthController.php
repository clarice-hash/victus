<?php
namespace App\Controllers;
use Exception;

require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../models/UserModel.php';

class AuthController {
    public function register() {
        $data = get_json_input();
        $name = trim($data['name'] ?? '');
        $email = strtolower(trim($data['email'] ?? ''));
        $password = $data['password'] ?? '';

        if (!$name || !$email || !$password) {
            json_response(['error'=>'Missing fields'], 400);
        }

        $userModel = new \App\Models\UserModel();
        if ($userModel->findByEmail($email)) {
            json_response(['error'=>'Email already registered'], 409);
        }

        $hash = password_hash($password, PASSWORD_DEFAULT);
        $id = $userModel->create($name, $email, $hash);

        $payload = ['sub'=>$id, 'email'=>$email, 'name'=>$name, 'iat'=>time(), 'exp'=>time()+JWT_TTL];
        $token = \Firebase\JWT\JWT::encode($payload, JWT_SECRET, 'HS256');

        json_response(['user'=>['id'=>$id,'name'=>$name,'email'=>$email], 'token'=>$token], 201);
    }

    public function login() {
        $data = get_json_input();
        $email = strtolower(trim($data['email'] ?? ''));
        $password = $data['password'] ?? '';
        if (!$email || !$password) json_response(['error'=>'Missing fields'], 400);

        $userModel = new \App\Models\UserModel();
        $user = $userModel->findByEmail($email);
        if (!$user || !password_verify($password, $user['password'])) {
            json_response(['error'=>'Invalid credentials'], 401);
        }

        $payload = ['sub'=>$user['id'], 'email'=>$user['email'], 'name'=>$user['name'], 'iat'=>time(), 'exp'=>time()+JWT_TTL];
        $token = \Firebase\JWT\JWT::encode($payload, JWT_SECRET, 'HS256');

        json_response(['user'=>['id'=>$user['id'],'name'=>$user['name'],'email'=>$user['email']], 'token'=>$token]);
    }

    public function forgotPassword() {
        $data = get_json_input();
        $email = strtolower(trim($data['email'] ?? ''));
        if (!$email) json_response(['error'=>'Missing email'], 400);

        $userModel = new \App\Models\UserModel();
        $user = $userModel->findByEmail($email);
        if (!$user) {
            // Don't reveal existence
            json_response(['message'=>'If the email exists, a reset token was generated.'], 200);
        }

        $token = bin2hex(random_bytes(16));
        $expires = date('Y-m-d H:i:s', time() + 3600);
        $db = db();
        $stmt = $db->prepare('INSERT INTO password_resets (email, token, expires_at) VALUES (:email, :token, :expires)');
        $stmt->execute([':email'=>$email, ':token'=>$token, ':expires'=>$expires]);

        json_response(['message'=>'Reset token generated (development mode)', 'token'=>$token]);
    }

    public function resetPassword() {
        $data = get_json_input();
        $token = $data['token'] ?? '';
        $new_password = $data['new_password'] ?? '';
        if (!$token || !$new_password) json_response(['error'=>'Missing token or new_password'], 400);

        $db = db();
        $stmt = $db->prepare('SELECT * FROM password_resets WHERE token = :token LIMIT 1');
        $stmt->execute([':token'=>$token]);
        $row = $stmt->fetch();
        if (!$row) json_response(['error'=>'Invalid token'], 400);

        if (strtotime($row['expires_at']) < time()) {
            json_response(['error'=>'Token expired'], 400);
        }

        $hash = password_hash($new_password, PASSWORD_DEFAULT);
        $stmt = $db->prepare('UPDATE users SET password = :password WHERE email = :email');
        $stmt->execute([':password'=>$hash, ':email'=>$row['email']]);

        $stmt = $db->prepare('DELETE FROM password_resets WHERE id = :id');
        $stmt->execute([':id'=>$row['id']]);

        json_response(['message'=>'Password reset successful']);
    }
}
