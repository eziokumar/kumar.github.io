<?php
declare(strict_types=1);

header('Content-Type: application/json');

function respond(bool $ok, string $message, array $extra = [], int $code = 0): void
{
    http_response_code($code ?: ($ok ? 200 : 400));
    echo json_encode(array_merge(['ok' => $ok, 'message' => $message], $extra));
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Method not allowed', [], 405);
}

$config = require __DIR__ . '/config.php';
if (!hash_equals((string) $config['admin_password'], (string) ($_POST['password'] ?? ''))) {
    respond(false, 'Incorrect admin password', [], 401);
}

$title = trim((string) ($_POST['title'] ?? ''));
$description = trim((string) ($_POST['description'] ?? ''));
$tagLabel = trim((string) ($_POST['tagLabel'] ?? ''));
$featured = ($_POST['featured'] ?? '') === '1';

if ($title === '') {
    respond(false, 'Title is required');
}
if (mb_strlen($title) > 150) {
    respond(false, 'Title is too long (max 150 characters)');
}
if (mb_strlen($description) > 4000) {
    respond(false, 'Description is too long (max 4000 characters)');
}
if (mb_strlen($tagLabel) > 60) {
    respond(false, 'Tag label is too long (max 60 characters)');
}

$slug = strtolower(trim($title));
$slug = preg_replace('/[^a-z0-9]+/', '-', $slug);
$slug = trim((string) $slug, '-');
if ($slug === '') {
    $slug = 'project';
}

$projectsFile = __DIR__ . '/../data/projects.json';
$projectsDir = __DIR__ . '/../images/projects';

$fp = fopen($projectsFile, 'c+');
if (!$fp) {
    respond(false, 'Could not open project data store', [], 500);
}
flock($fp, LOCK_EX);
$existingRaw = stream_get_contents($fp);
$projects = json_decode((string) $existingRaw, true);
if (!is_array($projects)) {
    $projects = [];
}

$existingIds = array_column($projects, 'id');
$baseSlug = $slug;
$n = 2;
while (in_array($slug, $existingIds, true)) {
    $slug = $baseSlug . '-' . $n;
    $n++;
}

$allowedExt = ['jpg' => true, 'jpeg' => true, 'png' => true, 'gif' => true, 'webp' => true];
$maxFileSize = 8 * 1024 * 1024;
$savedImages = [];

if (!empty($_FILES['images']) && is_array($_FILES['images']['name'])) {
    $count = count($_FILES['images']['name']);
    if ($count > 20) {
        flock($fp, LOCK_UN);
        fclose($fp);
        respond(false, 'Too many images (max 20)');
    }

    $targetDir = $projectsDir . '/' . $slug;
    if (!is_dir($targetDir) && !mkdir($targetDir, 0755, true)) {
        flock($fp, LOCK_UN);
        fclose($fp);
        respond(false, 'Could not create image folder', [], 500);
    }

    for ($i = 0; $i < $count; $i++) {
        $error = $_FILES['images']['error'][$i];
        if ($error === UPLOAD_ERR_NO_FILE) {
            continue;
        }
        if ($error !== UPLOAD_ERR_OK) {
            flock($fp, LOCK_UN);
            fclose($fp);
            respond(false, 'Upload error on file ' . ($i + 1));
        }

        $tmpPath = $_FILES['images']['tmp_name'][$i];
        $size = (int) $_FILES['images']['size'][$i];
        if (!is_uploaded_file($tmpPath)) {
            flock($fp, LOCK_UN);
            fclose($fp);
            respond(false, 'Invalid upload');
        }
        if ($size > $maxFileSize) {
            flock($fp, LOCK_UN);
            fclose($fp);
            respond(false, 'Image ' . ($i + 1) . ' is too large (max 8MB)');
        }

        $origName = (string) $_FILES['images']['name'][$i];
        $ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
        if (!isset($allowedExt[$ext])) {
            flock($fp, LOCK_UN);
            fclose($fp);
            respond(false, 'Unsupported image type: .' . $ext);
        }

        $imageInfo = @getimagesize($tmpPath);
        if ($imageInfo === false) {
            flock($fp, LOCK_UN);
            fclose($fp);
            respond(false, 'File ' . ($i + 1) . ' is not a valid image');
        }

        $safeName = $slug . '-' . ($i + 1) . '.' . $ext;
        $destPath = $targetDir . '/' . $safeName;
        if (!move_uploaded_file($tmpPath, $destPath)) {
            flock($fp, LOCK_UN);
            fclose($fp);
            respond(false, 'Could not save image ' . ($i + 1), [], 500);
        }
        $savedImages[] = 'images/projects/' . $slug . '/' . $safeName;
    }
}

if (empty($savedImages)) {
    flock($fp, LOCK_UN);
    fclose($fp);
    respond(false, 'At least one image is required');
}

$newProject = [
    'id' => $slug,
    'title' => $title,
    'description' => $description,
    'tagLabel' => $tagLabel,
    'featured' => $featured,
    'images' => $savedImages,
];

$projects[] = $newProject;

ftruncate($fp, 0);
rewind($fp);
fwrite($fp, (string) json_encode($projects, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
fflush($fp);
flock($fp, LOCK_UN);
fclose($fp);

respond(true, 'Project added', ['project' => $newProject]);
