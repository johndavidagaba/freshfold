import { createHash } from "node:crypto";
import argon2 from "@node-rs/argon2";

const { Algorithm, hash } = argon2;
const password = "correct-horse-battery";
const options = { algorithm: Algorithm.Argon2id };

const firstHash = await hash(password, options);
const secondHash = await hash(password, options);

console.log("Argon2id hash 1:", firstHash);
console.log("Argon2id hash 2:", secondHash);

const argon2Runs = 10;
const argon2Start = performance.now();

for (let i = 0; i < argon2Runs; i += 1) {
  await hash(password, options);
}

const argon2TotalMs = performance.now() - argon2Start;
const argon2AverageMs = argon2TotalMs / argon2Runs;
const argon2GuessesPerSecond = 1000 / argon2AverageMs;

const sha256Runs = 100000;
const sha256Start = performance.now();

for (let i = 0; i < sha256Runs; i += 1) {
  createHash("sha256").update(password).digest("hex");
}

const sha256TotalMs = performance.now() - sha256Start;
const sha256AverageMicroseconds = (sha256TotalMs * 1000) / sha256Runs;
const sha256AverageMs = sha256AverageMicroseconds / 1000;
const sha256GuessesPerSecond = 1000 / sha256AverageMs;

console.log(
  `Argon2id average: ${argon2AverageMs.toFixed(2)} ms/hash (${argon2GuessesPerSecond.toFixed(2)} guesses/second)`
);
console.log(
  `SHA-256 average: ${sha256AverageMicroseconds.toFixed(3)} microseconds/hash (${sha256GuessesPerSecond.toFixed(2)} guesses/second)`
);
console.log(
  `Ratio (SHA-256 / Argon2id guesses/second): ${(sha256GuessesPerSecond / argon2GuessesPerSecond).toFixed(2)}x`
);
