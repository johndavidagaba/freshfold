import { readFileSync } from "node:fs";
import { join } from "node:path";

const TOKEN_NAMES = [
  "--color-primary",
  "--color-on-primary",
  "--color-surface",
  "--color-on-surface",
  "--color-on-surface-variant",
  "--color-outline-variant",
] as const;

type TokenName = (typeof TOKEN_NAMES)[number];

function readColors(): Record<TokenName, string> {
  const css = readFileSync(join(process.cwd(), "styles", "tokens.css"), "utf8");
  const values = new Map<string, string>();

  for (const match of css.matchAll(/(--color-[a-z-]+)\s*:\s*([^;]+);/g)) {
    values.set(match[1], match[2].trim());
  }

  const colors = {} as Record<TokenName, string>;

  for (const name of TOKEN_NAMES) {
    const value = values.get(name);

    if (!value) {
      throw new Error(`Missing design token ${name}`);
    }

    colors[name] = value;
  }

  return colors;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

export function verificationEmailHtml(name: string, code: string): string {
  const colors = readColors();

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Your FreshFold code</title>
  </head>
  <body style="margin: 0; padding: 24px 16px; background-color: ${colors["--color-surface"]}; font-family: 'Atkinson Hyperlegible Next', Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 420px; border-collapse: collapse; border: 1px solid ${colors["--color-outline-variant"]}; border-radius: 16px; background-color: ${colors["--color-surface"]};">
            <tr>
              <td style="padding: 24px 20px;">
                <h1 style="margin: 0 0 16px; font-family: 'Atkinson Hyperlegible Next', Arial, sans-serif; font-size: 28px; font-weight: 600; line-height: 1.4; color: ${colors["--color-primary"]};">FreshFold</h1>
                <p style="margin: 0 0 16px; font-family: 'Atkinson Hyperlegible Next', Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 1.6; color: ${colors["--color-on-surface"]};">Hi ${escapeHtml(name)}, your FreshFold code is:</p>
                <p style="margin: 0 0 16px; padding: 16px; border-radius: 12px; background-color: ${colors["--color-primary"]}; color: ${colors["--color-on-primary"]}; font-family: 'Atkinson Hyperlegible Next', Arial, sans-serif; font-size: 36px; font-weight: 600; line-height: 1.2; letter-spacing: 4px; text-align: center;">${escapeHtml(code)}</p>
                <p style="margin: 0 0 8px; font-family: 'Atkinson Hyperlegible Next', Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 1.6; color: ${colors["--color-on-surface"]};">It expires in 10 minutes.</p>
                <p style="margin: 0; font-family: 'Atkinson Hyperlegible Next', Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 1.6; color: ${colors["--color-on-surface-variant"]};">If you didn't ask for this, you can ignore this email.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
