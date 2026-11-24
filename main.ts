// One Line of Earned Pride — make.fun bounty
// u-mang-one-line-of-earned-pride-a0138557
//
// The entry: one line, 1-240 UTF-8 characters, a quiet, earned moment of
// pride for someone in a scene. A borrowed guitar, two winters of practice,
// twelve people in a laundromat — a small person doing something hard, and
// the long effort finally landing in one read.
//
// This program validates the line against the bounty gate (1-240 chars,
// single line, not only whitespace, at least 3 words) and writes it to
// /output/entry.txt.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const ENTRY =
  "She had practised the same three chords for two winters on a borrowed guitar, and tonight, in front of twelve people in a laundromat, she played them without stopping once.";

function fail(message: string): never {
  throw new Error(`entry invalid: ${message}`);
}

function validate(line: string): void {
  // Gate: 1-240 UTF-8 characters, not only whitespace.
  const chars = [...line].length;
  if (chars < 1 || chars > 240) {
    fail(`length ${chars} characters, must be 1-240`);
  }
  if (line.trim().length === 0) {
    fail("line is only whitespace");
  }
  // Single line: no line breaks.
  if (/[\r\n]/.test(line)) {
    fail("line contains a line break");
  }
  // Byte-length gate: the file must be 1-240 bytes too, so a multi-byte
  // character can never smuggle the line past the character gate.
  const byteLength = Buffer.byteLength(line, "utf8");
  if (byteLength < 1 || byteLength > 240) {
    fail(`length ${byteLength} bytes, must be 1-240`);
  }
  // Must be printable text: no control characters other than plain spaces.
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(line)) {
    fail("line contains control characters");
  }
  // Must be a real sentence, not a fragment: at least 3 words.
  const words = line.trim().split(/\s+/);
  if (words.length < 3) {
    fail(`only ${words.length} words, need at least 3`);
  }
  // Must read like a scene with a person doing something hard: it needs a
  // person marker and a verb of effort in it.
  if (!/\b(she|he|they|her|his|their)\b/i.test(line)) {
    fail("no person marker in the line");
  }
  if (!/\b(practised|practiced|built|carried|climbed|finished|learned|played|kept|held)\b/i.test(line)) {
    fail("no verb of effort in the line");
  }
}

validate(ENTRY);

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", ENTRY, "utf8");

// Round-trip verification: read the written file back and confirm it is
// byte-for-byte identical to the validated entry.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== ENTRY) {
  fail("written entry.txt does not round-trip byte-for-byte");
}
const writtenBytes = readFileSync("/output/entry.txt");
if (writtenBytes.length !== Buffer.byteLength(ENTRY, "utf8")) {
  fail("written entry.txt byte length mismatch");
}

const bytes = Buffer.byteLength(ENTRY, "utf8");
const words = ENTRY.trim().split(/\s+/).length;
console.log(
  `entry.txt OK: ${[...ENTRY].length} characters, ${bytes} bytes, ${words} words, written to /output/entry.txt`,
);
