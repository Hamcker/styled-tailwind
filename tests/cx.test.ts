import { describe, it, expect } from "bun:test";
import { cx } from "../src/cx";

describe("cx", () => {
  it("joins simple strings", () => {
    expect(cx("a", "b", "c")).toBe("a b c");
  });

  it("handles arrays and falsy values", () => {
    expect(cx("a", ["b", false, null], undefined, 0 && "x", "c")).toBe("a b c");
  });

  it("coerces non-strings", () => {
    expect(cx("a", 2, true)).toBe("a 2 true");
  });
});

