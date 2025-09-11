<div align="center">

# styled-tailwind

Tiny, zero-CSS-in-JS `styled()` for React — write Tailwind classes with a familiar styled-components / emotion API.

[![npm version](https://img.shields.io/npm/v/%40hamcker%2Fstyled-tailwind?color=%23008cff&label=%40hamcker%2Fstyled-tailwind)](https://www.npmjs.com/package/@hamcker/styled-tailwind)
[![bundle size](https://img.shields.io/bundlephobia/minzip/%40hamcker%2Fstyled-tailwind)](https://bundlephobia.com/package/@hamcker/styled-tailwind)
[![types](https://img.shields.io/badge/types-TypeScript-3178c6)](#typescript)
[![license](https://img.shields.io/badge/license-MIT-black)](#license)
[![built with Bun](https://img.shields.io/badge/built%20with-Bun-000?logo=bun)](https://bun.sh)

</div>

**What it is:** A tiny utility that returns React components from tagged templates of Tailwind classes, just like `styled-components`/`@emotion/styled` — but without runtime styles, no style tags, and no Babel plugins. It only concatenates class names.

**What it’s not:** A CSS-in-JS engine. There’s no style injection or compiler; Tailwind does the styling, you get a clean component API.

—

## Features

- Minimal: tiny surface area, no config, no runtime CSS
- Familiar: `styled.div`...`` and `styled(Component)`...`` APIs
- Composable: merge incoming `className` + computed classes
- Typed: full TypeScript inference for intrinsic tags and custom components
- Polymorphic: change the underlying tag via `as`
- React-compatible: works from React 16.8+ (hooks + forwardRef)

## Install

- Peer deps: `react` (>= 16.8), `tailwindcss` (>= 3)

```
# with bun
bun add @hamcker/styled-tailwind

# or with npm / pnpm / yarn
npm i @hamcker/styled-tailwind
```

## Quick Start

```tsx
import { styled } from "@hamcker/styled-tailwind";

// 1) Intrinsic element
const MyDiv = styled.div`bg-blue`;
// <MyDiv>hello</MyDiv> -> <div class="bg-blue">hello</div>

// 2) Props-driven classes
const Box = styled.div<{ primary?: boolean }>`
  p-4 rounded
  ${(p) => (p.primary ? "bg-blue-600 text-white" : "bg-gray-100")}
`;

// 3) Custom component
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

// 4) Polymorphic via `as`
const Linky = styled.div`underline`;
// <Linky as="a" href="#">link</Linky> -> <a class="underline" href="#">link</a>
```

### Why tagged templates?

- JavaScript requires either a function call or a tagged template; syntax like `styled.divbg-blue` is not valid JS.
- This utility mirrors `styled-components`/`@emotion/styled` with backticks: `styled.div`bg-blue``.

## API

- `styled.tag\`...\``: for any HTML tag, e.g. `styled.div`, `styled.button`.
- `styled(Component)\`...\``: wrap your own component.
- Interpolations: plain strings/numbers, falsy (`null | undefined | false`), or `(props) => string | number | falsy`.
- `className` merge: incoming `className` is concatenated with computed classes.
- Polymorphic: optional `as` prop to swap the underlying element.
- Ref forwarding: components are `React.forwardRef`-aware.

### Extra utilities

- `cx(...parts)`: safe class concatenation.
- `compileClasses(strings, exprs, props)`: turns a tagged template + interpolations into a final class string.

## TypeScript

- Inference for intrinsic tags and custom components.
- Add prop types: `styled.div<{ primary?: boolean }>`.
- `as` prop is typed as `React.ElementType` for flexibility.

## Testing

- Run tests: `bun test`
- Tests use Bun’s built-in `bun:test` and assert on returned React elements.

## Performance & SSR

- No style sheet manipulation — class strings are computed and attached once.
- SSR works out of the box; output is plain React elements with `className`.

## Comparison

- Like `styled-components` or `@emotion/styled`, but outputs Tailwind classes and doesn’t inject CSS.
- No Babel/runtime styling; bring your own Tailwind setup for styles.

## Build

- `bun run build` outputs ESM (`dist/index.js`), CJS (`dist/index.cjs`), and types (`dist/index.d.ts`).

## License

MIT © [Hamcker](https://github.com/Hamcker)
