<?php
namespace App\Controllers;
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../models/UserModel.php';

class UserController {
    public function me() {
        $payload = require_auth();
        $userModel = new \App\Models\UserModel();
        $user = $userModel->findById((int)$payload['sub']);
        if (!$user) json_response(['error'=>'User not found'], 404);
        json_response(['user'=>$user]);
    }
}
