<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    json_response(405, ['ok' => false, 'message' => 'Method not allowed.']);
}

$rawBody = file_get_contents('php://input');
$payload = json_decode($rawBody ?: '', true);
if (!is_array($payload)) {
    $payload = $_POST;
}
if (!is_array($payload)) {
    $payload = [];
}

/* ----------------------------- Honeypot ----------------------------- */

if (trim((string) ($payload['botcheck'] ?? $payload['website'] ?? '')) !== '') {
    // Pretend success so bots do not learn the trap.
    json_response(200, ['ok' => true]);
}

/* ---------------------------- Validation ---------------------------- */

function text_length(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
}

$errors = [];

$name = trim((string) ($payload['name'] ?? ''));
if (text_length($name) < 2 || text_length($name) > 120) {
    $errors['name'] = 'Please enter your full name.';
}

$property = trim((string) ($payload['property'] ?? ''));
if (text_length($property) < 2 || text_length($property) > 120) {
    $errors['property'] = 'Please enter your property name.';
}

$email = trim((string) ($payload['email'] ?? ''));
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || text_length($email) > 190) {
    $errors['email'] = 'Please enter a valid email address.';
}

$phone = trim((string) ($payload['phone'] ?? ''));
if (text_length($phone) > 40) {
    $errors['phone'] = 'Please enter a valid phone number.';
}

$message = trim((string) ($payload['message'] ?? ''));
if (text_length($message) < 10 || text_length($message) > 3000) {
    $errors['message'] = 'Please tell us a little more (at least 10 characters, max 3000).';
}

if ($errors !== []) {
    json_response(422, [
        'ok' => false,
        'message' => 'Please check the form and try again.',
        'errors' => $errors,
    ]);
}

/* ---------------------------- Mail config --------------------------- */

$fromAddress = env('MAIL_FROM_ADDRESS', env('MAIL_USERNAME'));
$fromName = env('MAIL_FROM_NAME', 'STAY by My Marrakech Trip');
$adminEmail = env('ADMIN_EMAIL');
$adminName = env('ADMIN_NAME', $fromName);
$smtpUsername = env('MAIL_USERNAME');
$smtpPassword = env('MAIL_PASSWORD');

if (
    $fromAddress === ''
    || $smtpUsername === ''
    || $smtpPassword === ''
    || !filter_var($adminEmail, FILTER_VALIDATE_EMAIL)
) {
    error_log('[inquiry] Mail configuration is incomplete.');
    json_response(503, [
        'ok' => false,
        'message' => 'The form is not available right now. Please contact us directly.',
    ]);
}

/* ------------------------------ Data -------------------------------- */

$nameParts = preg_split('/\s+/u', $name) ?: [$name];
$firstName = ($nameParts[0] ?? '') !== '' ? $nameParts[0] : $name;

$siteUrl = rtrim(env('SITE_URL', ''), '/');
$whatsappNumber = preg_replace('/\D+/', '', env('WHATSAPP_NUMBER', '')) ?: '';
$whatsappLink = $whatsappNumber !== ''
    ? 'https://wa.me/' . $whatsappNumber
    : '';

$templateData = [
    'name' => $name,
    'firstName' => $firstName,
    'email' => $email,
    'phone' => $phone !== '' ? $phone : 'Not provided',
    'property' => $property,
    'message' => $message !== '' ? $message : 'No additional details provided.',
    'submittedAt' => (new DateTimeImmutable('now'))->format('j F Y, H:i'),
    'ipAddress' => $_SERVER['REMOTE_ADDR'] ?? 'Unknown',
    'siteUrl' => $siteUrl,
    'whatsappLink' => $whatsappLink,
    'year' => date('Y'),
    'brandName' => $fromName,
    'adminEmail' => $adminEmail,
    'adminName' => $adminName,
];

/* ------------------------------ Mailers ----------------------------- */

function make_mailer(string $fromAddress, string $fromName): PHPMailer
{
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = env('MAIL_HOST', 'smtp.hostinger.com');
    $mail->SMTPAuth = env('MAIL_USERNAME') !== '';
    $mail->Username = env('MAIL_USERNAME');
    $mail->Password = env('MAIL_PASSWORD');
    $mail->SMTPDebug = SMTP::DEBUG_OFF;
    $mail->CharSet = 'UTF-8';
    $mail->Timeout = 20;

    $encryption = strtolower(env('MAIL_ENCRYPTION', 'ssl'));

    if ($encryption === 'tls') {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $defaultPort = 587;
    } elseif ($encryption === 'none') {
        $mail->SMTPSecure = '';
        $defaultPort = 25;
    } else {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $defaultPort = 465;
    }

    $port = (int) env('MAIL_PORT', (string) $defaultPort);
    $mail->Port = $port > 0 ? $port : $defaultPort;
    $mail->setFrom($fromAddress, $fromName);
    $mail->isHTML(true);

    return $mail;
}

function client_plain_text(array $data): string
{
    return "Thank you, {$data['firstName']}.\n\n"
        . "We have received your message and will reply within 24-48 hours.\n\n"
        . "Property: {$data['property']}\n"
        . ($data['whatsappLink'] !== '' ? "WhatsApp: {$data['whatsappLink']}\n" : '')
        . ($data['siteUrl'] !== '' ? "Website: {$data['siteUrl']}\n" : '');
}

function admin_plain_text(array $data): string
{
    return "New inquiry\n\n"
        . "Name: {$data['name']}\n"
        . "Property: {$data['property']}\n"
        . "Email: {$data['email']}\n"
        . "Phone: {$data['phone']}\n"
        . "Submitted: {$data['submittedAt']}\n\n"
        . "Message:\n{$data['message']}\n";
}

$subjectName = str_replace(["\r", "\n"], ' ', $name);
$subjectProperty = str_replace(["\r", "\n"], ' ', $property);

/* -------------------------- Admin notification ---------------------- */

try {
    $adminMail = make_mailer($fromAddress, $fromName);
    $adminMail->addAddress($adminEmail, $adminName);
    $adminMail->addReplyTo($email, $subjectName);
    $adminMail->Subject = "New STAY enquiry: {$subjectProperty} - {$subjectName}";
    $adminMail->Body = render_template(
        __DIR__ . '/templates/admin-notification.php',
        $templateData
    );
    $adminMail->AltBody = admin_plain_text($templateData);
    $adminMail->send();
} catch (Throwable $exception) {
    error_log('[inquiry] Admin email failed: ' . $exception->getMessage());
    json_response(500, [
        'ok' => false,
        'message' => 'We could not send your message. Please try again or contact us directly.',
    ]);
}

/* --------------------------- Client thank-you ----------------------- */

try {
    $clientMail = make_mailer($fromAddress, $fromName);
    $clientMail->addAddress($email, $subjectName);
    $clientMail->addReplyTo($adminEmail, $adminName);
    $clientMail->Subject = 'Thank you for your enquiry — STAY by My Marrakech Trip';
    $clientMail->Body = render_template(
        __DIR__ . '/templates/client-thank-you.php',
        $templateData
    );
    $clientMail->AltBody = client_plain_text($templateData);
    $clientMail->send();
} catch (Throwable $exception) {
    // The admin already has the lead; do not block the visitor.
    error_log('[inquiry] Client email failed: ' . $exception->getMessage());
}

json_response(200, [
    'ok' => true,
    'message' => 'Thank you. Your enquiry has been sent.',
]);