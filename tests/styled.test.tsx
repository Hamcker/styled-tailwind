import { describe, it, expect } from "bun:test";
import * as React from "react";
import { styled } from "../src";

describe("styled - intrinsic elements", () => {
  const MyDiv = styled.div`bg-blue`;

  it("computes class from template", () => {
    const el = (MyDiv as any).render({ children: "hello" }, null);
    expect(el.type).toBe("div");
    expect(el.props.children).toBe("hello");
    expect(el.props.className).toContain("bg-blue");
  });

  it("merges incoming className with computed classes", () => {
    const el = (MyDiv as any).render({ className: "mt-2", children: "x" }, null);
    expect(el.props.className).toContain("mt-2");
    expect(el.props.className).toContain("bg-blue");
  });
});

describe("styled - prop-based classes", () => {
  const Box = styled.div<{ primary?: boolean }>`p-4 ${(p) => (p.primary ? "bg-blue-600 text-white" : "bg-gray-100")}`;

  it("applies truthy branch", () => {
    const el = (Box as any).render({ primary: true, children: "y" }, null);
    expect(el.props.className).toContain("p-4");
    expect(el.props.className).toContain("bg-blue-600");
    expect(el.props.className).toContain("text-white");
  });

  it("applies falsy branch", () => {
    const el = (Box as any).render({ children: "n" }, null);
    expect(el.props.className).toContain("p-4");
    expect(el.props.className).toContain("bg-gray-100");
  });
});

describe("styled - custom component", () => {
  type FancyProps = { title: string; className?: string; children?: React.ReactNode };
  function Fancy({ title, className, children }: FancyProps) {
    return (
      <section className={className}>
        <h2>{title}</h2>
        {children}
      </section>
    );
  }
  const StyledFancy = styled(Fancy)`border p-2 shadow`;

  it("wraps custom component and forwards className", () => {
    const el = (StyledFancy as any).render({ title: "A", children: "B" }, null);
    // Should render Fancy with computed className
    expect(el.type).toBe(Fancy);
    expect(el.props.className).toContain("border");
    expect(el.props.className).toContain("p-2");
    expect(el.props.className).toContain("shadow");
  });
});

describe("styled - polymorphic 'as' prop", () => {
  const Poly = styled.div`underline`;

  it("renders different tag when using 'as'", () => {
    const el = (Poly as any).render({ as: "a", href: "#", children: "link" }, null);
    expect(el.type).toBe("a");
    expect(el.props.className).toContain("underline");
    expect(el.props.href).toBe("#");
  });
});

describe("styled - forwardRef component", () => {
  const Textarea = React.forwardRef<
    HTMLTextAreaElement,
    React.ComponentProps<"textarea">
  >(({ className, ...props }, ref) => {
    return (
      <textarea
        className={[(className || "")].join(" ").trim()}
        ref={ref}
        {...props}
      />
    );
  });
  Textarea.displayName = "Textarea";

  const STextarea = styled(Textarea)`bg-green-500`;

  it("wraps forwardRef component and forwards className", () => {
    const el = (STextarea as any).render({ className: "mt-3", children: "x" }, null);
    expect(el.props.className).toContain("bg-green-500");
    expect(el.props.className).toContain("mt-3");
  });
});
