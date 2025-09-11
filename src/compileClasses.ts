/** turn a tagged template (with optional prop-based interpolations) into a final className */
export function compileClasses<P>(
  strings: TemplateStringsArray,
  exprs: Array<
    | string
    | number
    | null
    | undefined
    | false
    | ((props: P) => string | number | null | undefined | false)
  >,
  props: P
) {
  let out = "";
  strings.forEach((chunk, i) => {
    out += chunk;
    if (i < exprs.length) {
      const v = exprs[i] as any;
      out += typeof v === "function" ? (v as (p: P) => any)(props) ?? "" : v ?? "";
    }
  });
  // collapse whitespace -> class tokens
  return out
    .split(/\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .join(" ");
}

