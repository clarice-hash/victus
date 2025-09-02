<?php
require_once __DIR__ . '/../config.php';
$db = db();
$adminPass = password_hash('admin123', PASSWORD_DEFAULT);
$stmt = $db->prepare('INSERT IGNORE INTO users (name,email,password,role) VALUES (:name,:email,:password,:role)');
$stmt->execute([':name'=>'Admin',':email'=>'admin@example.com',':password'=>$adminPass,':role'=>'admin']);
$db->exec("INSERT IGNORE INTO library_items (id,title,description,type,thumbnail) VALUES
(1,'Ebook Exemplo','Descricao do ebook','ebook','/public/thumbnails/ebook1.png'),
(2,'Artigo Exemplo','Descricao do artigo','article','/public/thumbnails/article1.png'),
(3,'Video Exemplo','Descricao do video','video','/public/thumbnails/video1.png')");
$db->exec("INSERT IGNORE INTO media_files (library_item_id,file_url,mime_type,duration_seconds) VALUES
(3, 'https://www.w3schools.com/html/mov_bbb.mp4', 'video/mp4', 10)");
echo "Seeds inserted.\n";
