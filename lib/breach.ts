import { createHash } from "node:crypto";

export async function getBreachCount(password: string): Promise<number | null> {
  const hash = createHash("sha1").update(password).digest("hex").toUpperCase();
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);

  try {
    const response = await fetch(
      `https://api.pwnedpasswords.com/range/${prefix}`,
      {
        headers: { "Add-Padding": "true" },
      }
    );

    if (!response.ok) {
      console.warn(
        `[breach] Have I Been Pwned request failed with ${response.status}`
      );
      return null;
    }

    const body = await response.text();

    for (const line of body.split(/\r?\n/)) {
      const [lineSuffix, lineCount] = line.split(":");

      if (lineSuffix?.toUpperCase() === suffix) {
        return Number.parseInt(lineCount ?? "0", 10) || 0;
      }
    }

    return 0;
  } catch (error) {
    console.warn("[breach] Have I Been Pwned request failed", error);
    return null;
  }
}
