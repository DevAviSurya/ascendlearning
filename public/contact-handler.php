<?php
// Contact form backend for ContactForm.astro. This is a plain static PHP
// file (not an Astro route), so it works as-is on any PHP-capable host
// alongside the static `dist/` build — no Astro server adapter needed.
//
// TESTING: recipient is set to avi.surya@gmail.com. Change
// CONTACT_RECIPIENT_EMAIL before going live.
//
// Point the site at this script by setting, in `.env`:
//   PUBLIC_FORM_ENDPOINT=https://your-domain.com/contact-handler.php
//
// Note: PHP's mail() depends on the host having a working mail transport
// (sendmail/Postfix) and is often flagged as spam without proper SPF/DKIM
// records for the sending domain. For production, consider swapping the
// mail() call below for an SMTP library (e.g. PHPMailer) or a transactional
// email provider (SendGrid, Postmark, SES) instead.

const CONTACT_RECIPIENT_EMAIL = 'avi.surya@gmail.com';
const CONTACT_FROM_EMAIL = 'no-reply@ascendlearning.courses';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

function respond(int $status, bool $ok, string $message): never {
    http_response_code($status);
    echo json_encode(['ok' => $ok, 'message' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, false, 'Method not allowed.');
}

// Honeypot: bots that fill this hidden field get a fake success response.
if (!empty($_POST['company'])) {
    respond(200, true, 'Thanks!');
}

$name = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$phone = trim((string) ($_POST['phone'] ?? ''));
$reason = trim((string) ($_POST['reason'] ?? ''));

if ($name === '' || $reason === '') {
    respond(422, false, 'Name and reason for contacting are required.');
}

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, false, 'A valid email address is required.');
}

$subject = 'New contact form submission — Ascend Professional Institute';

$body = "You've received a new contact form submission:\n\n"
    . "Name: {$name}\n"
    . "Email: {$email}\n"
    . 'Phone: ' . ($phone !== '' ? $phone : 'Not provided') . "\n\n"
    . "Reason for contacting:\n{$reason}\n";

$headers = [
    'From: Ascend Professional Institute <' . CONTACT_FROM_EMAIL . '>',
    // $email already passed FILTER_VALIDATE_EMAIL, so it cannot contain the
    // CR/LF needed for header injection.
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=utf-8',
];

$sent = mail(CONTACT_RECIPIENT_EMAIL, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    respond(502, false, 'Message could not be sent. Please try again later.');
}

respond(200, true, "Thanks! Your message has been sent — we'll be in touch shortly.");
