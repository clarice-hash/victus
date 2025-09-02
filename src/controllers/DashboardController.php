<?php
namespace App\Controllers;
require_once __DIR__ . '/../../config.php';

class DashboardController {
    public function overview() {
        $db = db();
        $users = $db->query('SELECT COUNT(*) AS c FROM users')->fetch()['c'] ?? 0;
        $videos = $db->query("SELECT COUNT(*) AS c FROM library_items WHERE type='video'")->fetch()['c'] ?? 0;
        $activities = $db->query('SELECT * FROM activities ORDER BY created_at DESC LIMIT 5')->fetchAll();
        json_response(['users_count'=>$users,'videos_count'=>$videos,'recent_activities'=>$activities]);
    }
}
