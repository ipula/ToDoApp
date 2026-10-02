import { describe, expect, it } from "vitest";
import { pageCount, pageSearch, parsePage } from "./pagination.ts";

describe("parsePage", () => {
  it("accepts positive whole numbers", () => {
    expect(parsePage("1")).toBe(1);
    expect(parsePage("7")).toBe(7);
  });

  it.each([null, "", "0", "-2", "1.5", "abc"])("falls back to 1 for %j", (value) => {
    expect(parsePage(value)).toBe(1);
  });
});

describe("pageCount", () => {
  it("rounds up partial pages", () => {
    expect(pageCount(21, 10)).toBe(3);
  });

  it("counts exact multiples without an extra page", () => {
    expect(pageCount(20, 10)).toBe(2);
  });

  it("is at least 1, even with no todos", () => {
    expect(pageCount(0, 10)).toBe(1);
  });
});

describe("pageSearch", () => {
  it("uses the clean URL for page 1", () => {
    expect(pageSearch(1)).toBe("");
  });

  it("adds ?page= for later pages", () => {
    expect(pageSearch(3)).toBe("?page=3");
  });
});