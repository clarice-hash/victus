<?php
namespace App\Models;
class UserModel {
    private $db;
    public function __construct() {
        $this->db = db();
    }
    public function create(string $name, string $email, string $password): int {
        $stmt = $this->db->prepare('INSERT INTO users (name,email,password) VALUES (:name,:email,:password)');
        $stmt->execute([':name'=>$name, ':email'=>$email, ':password'=>$password]);
        return (int)$this->db->lastInsertId();
    }
    public function findByEmail(string $email): ?array {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE email = :email LIMIT 1');
        $stmt->execute([':email'=>$email]);
        $r = $stmt->fetch();
        return $r ?: null;
    }
    public function findById(int $id): ?array {
        $stmt = $this->db->prepare('SELECT id,name,email,role,created_at FROM users WHERE id = :id');
        $stmt->execute([':id'=>$id]);
        $r = $stmt->fetch();
        return $r ?: null;
    }
}
