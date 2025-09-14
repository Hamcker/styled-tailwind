import * as React from "react";
import { cx } from "./cx";
import { compileClasses } from "./compileClasses";

type AnyComponent = keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>;

/** core factory: wraps an underlying element/component with a class template */
function styledFactory<C extends AnyComponent>(Comp: C) {
  return function styledTemplate<
    P extends React.ComponentPropsWithoutRef<C> & {
      className?: string;
    } & Record<string, any>
  >(
    strings: TemplateStringsArray,
    ...exprs: Array<
      | string
      | number
      | null
      | undefined
      | false
      | ((props: P) => string | number | null | undefined | false)
    >
  ) {
    type Props = P & { as?: AnyComponent };
    const Styled = React.forwardRef<React.ElementRef<C>, Props>(function Styled(
      { className, as, ...rest }: Props,
      ref
    ) {
      const FinalComp: any = as ?? (Comp as any);
      const computed = compileClasses<Props>(
        strings,
        exprs as any[],
        {
          ...(rest as any),
          className,
        } as Props
      );
      return (
        <FinalComp
          ref={ref as any}
          {...(rest as any)}
          className={cx(className, computed)}
        />
      );
    });

    const baseName =
      typeof Comp === "string"
        ? Comp
        : (Comp as any).displayName || (Comp as any).name || "Component";
    (Styled as any).displayName = `styled(${baseName})`;

    return Styled;
  };
}

type StyledTag<K extends keyof JSX.IntrinsicElements> = ReturnType<
  typeof styledFactory<K>
>;

type StyledNamespace = {
  [K in keyof JSX.IntrinsicElements]: StyledTag<K>;
} & (<C extends React.ElementType>(
  comp: C
) => ReturnType<typeof styledFactory<C>>);

// At runtime, we accept any string key and return styledFactory(key)
const styledImpl = new Proxy(styledFactory as any, {
  get(_target, prop: PropertyKey) {
    if (typeof prop === "string") {
      return styledFactory(prop as keyof JSX.IntrinsicElements);
    }
    return undefined;
  },
  apply(_target, _thisArg, argArray: any[]) {
    const [comp] = argArray;
    return styledFactory(comp);
  },
});

export const styled = styledImpl as StyledNamespace;

export { cx, compileClasses };
