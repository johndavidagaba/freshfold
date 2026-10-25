import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tokensFile = join(projectRoot, "tokens", "tokens.json");
const outputFile = join(projectRoot, "styles", "tokens.css");

const tokens = JSON.parse(await readFile(tokensFile, "utf8"));

function getPath(source, keys, label = keys.join(".")) {
  let current = source;

  for (const key of keys) {
    if (current === null || typeof current !== "object" || !(key in current)) {
      throw new Error(`Missing token path: ${label}`);
    }
    current = current[key];
  }

  return current;
}

function toCssColor(value, label) {
  if (typeof value !== "string" || !/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(value)) {
    throw new Error(`Invalid colour value at ${label}: ${String(value)}`);
  }

  if (value.length === 9 && value.slice(7).toLowerCase() === "ff") {
    return value.slice(0, 7);
  }

  return value;
}

function toPx(value, label) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Invalid numeric value at ${label}: ${String(value)}`);
  }

  return `${value}px`;
}

const colorLines = [];

const systemLight = getPath(tokens, ["color", "material-theme", "sys", "light"]);
for (const [role, token] of Object.entries(systemLight)) {
  colorLines.push(
    `  --color-${role}: ${toCssColor(token.value, `color.material-theme.sys.light.${role}`)};`,
  );
}

const statusRoles = [
  ["success", ["color", "material-theme", "extended", "success", "light", "color-container"]],
  ["on-success", ["color", "material-theme", "white"]],
  ["warning", ["color", "material-theme", "extended", "warning", "light", "color-container"]],
  ["on-warning", ["color", "material-theme", "white"]],
];

for (const [name, tokenPath] of statusRoles) {
  const token = getPath(tokens, tokenPath);
  colorLines.push(
    `  --color-${name}: ${toCssColor(token.value, tokenPath.join("."))};`,
  );
}

const typographyLines = [];
const fontStyles = ["display", "headline", "title", "body", "label"];
const fontSizes = ["large", "medium", "small"];

for (const role of fontStyles) {
  for (const size of fontSizes) {
    const label = `font.material-theme.${role}.${size}`;
    const style = getPath(tokens, ["font", "material-theme", role, size, "value"], label);
    const prefix = `--type-${role}-${size}`;

    if (typeof style.fontFamily !== "string" || style.fontFamily.length === 0) {
      throw new Error(`Invalid font family at ${label}.fontFamily`);
    }

    typographyLines.push(
      `  ${prefix}-family: "${style.fontFamily}", sans-serif;`,
      `  ${prefix}-size: ${toPx(style.fontSize, `${label}.fontSize`)};`,
      `  ${prefix}-weight: ${style.fontWeight};`,
      `  ${prefix}-line-height: ${toPx(style.lineHeight, `${label}.lineHeight`)};`,
      `  ${prefix}-letter-spacing: ${toPx(style.letterSpacing, `${label}.letterSpacing`)};`,
    );
  }
}

const shadowLines = [];
for (const name of ["soft", "medium", "hard"]) {
  const label = `effect.shadow.${name}`;
  const shadow = getPath(tokens, ["effect", "shadow", name, "value"], label);
  const parts = [
    toPx(shadow.offsetX, `${label}.offsetX`),
    toPx(shadow.offsetY, `${label}.offsetY`),
    toPx(shadow.radius, `${label}.radius`),
    toPx(shadow.spread, `${label}.spread`),
    toCssColor(shadow.color, `${label}.color`),
  ];

  shadowLines.push(`  --shadow-${name}: ${parts.join(" ")};`);
}

const css = [
  ":root {",
  ...colorLines,
  "",
  ...typographyLines,
  "",
  ...shadowLines,
  "}",
  "",
].join("\n");

await mkdir(dirname(outputFile), { recursive: true });
await writeFile(outputFile, css, "utf8");

console.log(`Wrote ${outputFile}`);
console.log(`Colour variables: ${colorLines.length}`);
console.log(`Typography variables: ${typographyLines.length}`);
console.log(`Shadow variables: ${shadowLines.length}`);
console.log(`Total variables: ${colorLines.length + typographyLines.length + shadowLines.length}`);
