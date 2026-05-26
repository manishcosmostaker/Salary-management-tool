import { describe, expect, it } from "vitest";

import {
  buildFullName,
  loadNameList,
  type RandomFn,
} from "@/lib/seed/name-generator";
import path from "node:path";

describe("loadNameList", () => {
  it("loads non-empty trimmed names from a file", () => {
    const names = loadNameList(
      path.join(process.cwd(), "data", "first_names.txt"),
    );
    expect(names.length).toBeGreaterThan(100);
    expect(names).toContain("James");
    expect(names.every((name) => name.length > 0)).toBe(true);
  });
});

describe("buildFullName", () => {
  const firstNames = ["Ada", "Grace"];
  const lastNames = ["Lovelace", "Hopper"];
  const rng: RandomFn = (() => {
    let index = 0;
    return () => {
      const value = index === 0 ? 0 : 0.99;
      index += 1;
      return value;
    };
  })();

  it("combines a first and last name with a space", () => {
    expect(buildFullName(firstNames, lastNames, rng)).toBe("Ada Hopper");
  });

  it("throws when name lists are empty", () => {
    expect(() => buildFullName([], lastNames)).toThrow(
      "First and last name lists must not be empty",
    );
  });
});
