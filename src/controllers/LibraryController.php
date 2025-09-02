<?php
namespace App\Controllers;
require_once __DIR__ . '/../../config.php';

class LibraryController {
    public function list() {
        $page = intval($_GET['page'] ?? 1);
        $per = intval($_GET['per'] ?? 20);
        $offset = ($page-1)*$per;
        $db = db();
        $stmt = $db->prepare('SELECT * FROM library_items ORDER BY id DESC LIMIT :l OFFSET :o');
        $stmt->bindValue(':l', $per, PDO::PARAM_INT);
        $stmt->bindValue(':o', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $items = $stmt->fetchAll();
        json_response(['items'=>$items, 'page'=>$page, 'per'=>$per]);
    }
    public function details($id) {
        $db = db();
        $stmt = $db->prepare('SELECT * FROM library_items WHERE id = :id LIMIT 1');
        $stmt->execute([':id'=>$id]);
        $item = $stmt->fetch();
        if (!$item) json_response(['error'=>'Not found'],404);
        $stmt = $db->prepare('SELECT * FROM media_files WHERE library_item_id = :id');
        $stmt->execute([':id'=>$id]);
        $files = $stmt->fetchAll();
        json_response(['item'=>$item, 'files'=>$files]);
    }
}
