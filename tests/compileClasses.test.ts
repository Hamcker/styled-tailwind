import { describe, it, expect } from "bun:test";
import { compileClasses } from "../src/compileClasses";

describe("compileClasses", () => {
  it("collapses whitespace and returns tokens", () => {
    const out = compileClasses(["  p-4    rounded   "] as any, [], {} as any);
    expect(out).toBe("p-4 rounded");
  });

  it("evaluates function interpolations with props", () => {
    type P = { primary?: boolean };
    const strings = ["base ", " "] as unknown as TemplateStringsArray;
    const exprs = [
      (p: P) => (p.primary ? "text-white bg-blue-600" : "text-black bg-gray-100"),
    ];
    const outTrue = compileClasses<P>(strings, exprs, { primary: true } as P);
    const outFalse = compileClasses<P>(strings, exprs, { primary: false } as P);
    expect(outTrue).toBe("base text-white bg-blue-600");
    expect(outFalse).toBe("base text-black bg-gray-100");
  });
});

