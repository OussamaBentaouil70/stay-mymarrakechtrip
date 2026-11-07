<?php
/** @var string $firstName */
/** @var string $property */
/** @var string $message */
/** @var string $whatsappLink */
/** @var string $siteUrl */
/** @var string $year */
/** @var string $brandName */
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Thank you</title>
</head>
<body style="margin:0;padding:0;background-color:#eeeeee;font-family:Arial,Helvetica,sans-serif;color:#333333;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#eeeeee;">
    <tr>
      <td align="center" style="padding:28px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:#ffffff;border:1px solid #dddddd;border-radius:6px;overflow:hidden;">

          <tr>
            <td style="background-color:#24201d;padding:28px 32px;text-align:center;">
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:21px;letter-spacing:0.14em;color:#f8f5f0;text-transform:uppercase;">
                <?= e($brandName) ?>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:34px 40px 8px;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:bold;letter-spacing:0.22em;text-transform:uppercase;color:#777777;">
                Thank you
              </p>
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:27px;line-height:1.3;font-weight:normal;color:#24201d;">
                Thank you, <?= e($firstName) ?>.
              </h1>
              <p style="margin:16px 0 0;font-size:15px;line-height:1.7;color:#555555;">
                We have received your enquiry regarding <strong style="color:#24201d;"><?= e($property) ?></strong> and our team will reply within
                <strong style="color:#24201d;">24–48 hours</strong>.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:22px 40px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f7f7f7;border-left:3px solid #24201d;">
                <tr>
                  <td style="padding:16px 18px;">
                    <span style="display:block;margin-bottom:6px;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#777777;">
                      Your message
                    </span>
                    <span style="font-size:13px;line-height:1.7;color:#444444;">
                      <?= nl2br(e($message)) ?>
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <?php if ($whatsappLink !== ''): ?>
            <tr>
              <td align="center" style="padding:28px 40px 8px;">
                <a href="<?= e($whatsappLink) ?>" style="display:inline-block;background-color:#24201d;color:#f8f5f0;text-decoration:none;padding:13px 26px;border-radius:4px;font-size:12px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;">
                  Chat on WhatsApp
                </a>
              </td>
            </tr>
          <?php endif; ?>

          <tr>
            <td style="padding:24px 40px 28px;">
              <div style="border-top:1px solid #dddddd;padding-top:18px;text-align:center;">
                <?php if ($siteUrl !== ''): ?>
                  <p style="margin:0 0 8px;font-size:12px;">
                    <a href="<?= e($siteUrl) ?>" style="color:#24201d;text-decoration:underline;">
                      <?= e($siteUrl) ?>
                    </a>
                  </p>
                <?php endif; ?>
                <p style="margin:0;font-size:11px;color:#999999;">
                  © <?= e($year) ?> <?= e($brandName) ?>
                </p>
              </div>
            </td          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>