import { readFileSync } from "node:fs";

export type RandomFn = () => number;

export function loadNameList(filePath: string): string[] {
  return readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export function buildFullName(
  firstNames: string[],
  lastNames: string[],
  random: RandomFn = Math.random,
): string {
  if (firstNames.length === 0 || lastNames.length === 0) {
    throw new Error("First and last name lists must not be empty");
  }

  const first =
    firstNames[Math.floor(random() * firstNames.length)] ?? firstNames[0];
  const last =
    lastNames[Math.floor(random() * lastNames.length)] ?? lastNames[0];

  return `${first} ${last}`;
}

export function createSeededRandom(seed: number): RandomFn {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
