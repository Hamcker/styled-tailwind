/** join classnames safely */
export function cx(...parts: Array<unknown>) {
  return parts
    .flatMap((p) => {
      if (Array.isArray(p)) return p.filter(Boolean).map((x) => String(x));
      if (typeof p === "string") return [p];
      return p ? [String(p)] : [];
    })
    .join(" ")
    .trim();
}
