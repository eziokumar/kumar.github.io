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

$id = trim((string) ($_POST['id'] ?? ''));
if ($id === '' || !preg_match('/^[a-z0-9-]+$/', $id)) {
    respond(false, 'Invalid project id');
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

$found = false;
$remaining = [];
foreach ($projects as $project) {
    if (($project['id'] ?? '') === $id) {
        $found = true;
    } else {
        $remaining[] = $project;
    }
}

if (!$found) {
    flock($fp, LOCK_UN);
    fclose($fp);
    respond(false, 'Project not found', [], 404);
}

ftruncate($fp, 0);
rewind($fp);
fwrite($fp, (string) json_encode($remaining, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
fflush($fp);
flock($fp, LOCK_UN);
fclose($fp);

// Best-effort cleanup of images that live in their own /images/projects/<id>/ folder
// (only projects created via the admin form; the containment check keeps this from
// ever touching anything outside that directory).
$targetDir = $projectsDir . '/' . $id;
$realProjectsDir = realpath($projectsDir);
$realTargetDir = realpath($targetDir);
if ($realTargetDir !== false && $realProjectsDir !== false && str_starts_with($realTargetDir, $realProjectsDir . DIRECTORY_SEPARATOR)) {
    foreach (glob($targetDir . '/*') ?: [] as $file) {
        if (is_file($file)) {
            unlink($file);
        }
    }
    @rmdir($targetDir);
}

respond(true, 'Project deleted');
