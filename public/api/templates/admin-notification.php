<?php
/** @var string $name */
/** @var string $firstName */
/** @var string $email */
/** @var string $phone */
/** @var string $property */
/** @var string $message */
/** @var string $submittedAt */
/** @var string $ipAddress */
/** @var string $siteUrl */
/** @var string $year */
/** @var string $brandName */
$replySubject = rawurlencode('Re: Your STAY enquiry');
$replyLink = 'mailto:' . $email . '?subject=' . $replySubject;
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>New enquiry</title>
</head>
<body style="margin:0;padding:0;background-color:#eeeeee;font-family:Arial,Helvetica,sans-serif;color:#333333;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#eeeeee;">
    <tr>
      <td align="center" style="padding:28px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:#ffffff;border:1px solid #dddddd;border-radius:6px;overflow:hidden;">

          <tr>
            <td style="background-color:#24201d;padding:26px 32px;">
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:20px;letter-spacing:0.14em;color:#f8f5f0;text-transform:uppercase;">
                <?= e($brandName) ?>
              </div>
              <div style="margin-top:6px;font-size:10px;letter-spacing:0.24em;color:#c39466;text-transform:uppercase;">
                New enquiry
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:30px 40px 6px;">
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.3;font-weight:normal;color:#24201d;">
                New enquiry from <?= e($name) ?>
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:22px 40px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #dddddd;">
                <tr>
                  <td style="padding:10px 14px;font-size:12px;color:#6b625a;border-bottom:1px solid #eeeeee;width:32%;">Name</td>
                  <td style="padding:10px 14px;font-size:13px;font-weight:bold;border-bottom:1px solid #eeeeee;"><?= e($name) ?></td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;font-size:12px;color:#6b625a;border-bottom:1px solid #eeeeee;">Property</td>
                  <td style="padding:10px 14px;font-size:13px;font-weight:bold;border-bottom:1px solid #eeeeee;"><?= e($property) ?></td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;font-size:12px;color:#6b625a;border-bottom:1px solid #eeeeee;">Email</td>
                  <td style="padding:10px 14px;font-size:13px;border-bottom:1px solid #eeeeee;">
                    <a href="mailto:<?= e($email) ?>" style="color:#24201d;"><?= e($email) ?></a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;font-size:12px;color:#6b625a;border-bottom:1px solid #eeeeee;">Phone</td>
                  <td style="padding:10px 14px;font-size:13px;border-bottom:1px solid #eeeeee;"><?= e($phone) ?></td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;font-size:12px;color:#6b625a;border-bottom:1px solid #eeeeee;">Submitted</td>
                  <td style="padding:10px 14px;font-size:13px;border-bottom:1px solid #eeeeee;"><?= e($submittedAt) ?></td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;font-size:12px;color:#6b625a;">IP</td>
                  <td style="padding:10px 14px;font-size:13px;"><?= e($ipAddress) ?></td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 40px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f7f7f7;border-left:3px solid #24201d;">
                <tr>
                  <td style="padding:16px 18px;">
                    <span style="display:block;margin-bottom:6px;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#6b625a;">
                      Message
                    </span>
                    <span style="font-size:13px;line-height:1.7;color:#444444;">
                      <?= nl2br(e($message)) ?>
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:26px 40px 8px;">
              <a href="<?= e($replyLink) ?>" style="display:inline-block;background-color:#24201d;color:#f8f5f0;text-decoration:none;padding:13px 26px;border-radius:4px;font-size:12px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;">
                Reply to <?= e($firstName) ?>
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding:22px 40px 26px;">
              <div style="border-top:1px solid #dddddd;padding-top:16px;text-align:center;">
                <p style="margin:0;font-size:11px;color:#999999;">
                  Sent from <?= e($brandName) ?><?php if ($siteUrl !== ''): ?> · <?= e($siteUrl) ?><?php endif; ?>
                </p>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>