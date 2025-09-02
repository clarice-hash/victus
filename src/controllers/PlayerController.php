<?php
namespace App\Controllers;
require_once __DIR__ . '/../../config.php';

class PlayerController {
    public function playlist($id) {
        $db = db();
        $stmt = $db->prepare('SELECT * FROM library_items WHERE id = :id LIMIT 1');
        $stmt->execute([':id'=>$id]);
        $item = $stmt->fetch();
        if (!$item) json_response(['error'=>'Not found'],404);
        $stmt = $db->prepare('SELECT * FROM media_files WHERE library_item_id = :id');
        $stmt->execute([':id'=>$id]);
        $files = $stmt->fetchAll();
        json_response(['title'=>$item['title'],'files'=>$files]);
    }
    public function saveProgress() {
        $data = get_json_input();
        json_response(['status'=>'ok','received'=>$data]);
    }
}
