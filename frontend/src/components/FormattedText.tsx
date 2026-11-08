import React, { type ReactNode, type ElementType } from "react";

interface ASTNode {
  type: "text" | "tag";
  value?: string;
  tag?: string;
  param?: string;
  children?: ASTNode[];
}

const COLOR_MAP: Record<string, string> = {
  x: "text-accent font-semibold",
  yellow: "text-accent font-semibold",
  accent: "text-accent font-semibold",
  gold: "text-amber-400 font-semibold",
  red: "text-red-400 font-medium",
  green: "text-emerald-400 font-medium",
  blue: "text-sky-400 font-medium",
  cyan: "text-cyan-400 font-medium",
  purple: "text-purple-400 font-medium",
  pink: "text-pink-400 font-medium",
  white: "text-white font-medium",
  gray: "text-gray-400",
  black: "text-black font-semibold",
};

const SUPPORTED_TAGS = new Set([
  "b",
  "bold",
  "i",
  "italic",
  "em",
  "u",
  "underline",
  "x",
  "yellow",
  "accent",
  "gold",
  "red",
  "green",
  "blue",
  "cyan",
  "purple",
  "pink",
  "white",
  "gray",
  "black",
  "color",
  "badge",
  "highlight",
  "code",
  "justify",
  "center",
  "right",
  "left",
  "align",
  "br",
  "p",
]);

/**
 * Parses BBCode-style formatting tags into an Abstract Syntax Tree (AST).
 * Safe, robust against malformed/unclosed tags, and supports nesting.
 */
export function parseFormattedText(text: string): ASTNode[] {
  if (!text || typeof text !== "string") return [];

  const tagRegex = /\[(\/)?([a-zA-Z0-9_-]+)(?:=([^\]]+))?\]/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  interface StackFrame {
    tag: string;
    param?: string;
    children: ASTNode[];
  }

  const root: ASTNode[] = [];
  const stack: StackFrame[] = [];

  const currentChildren = () =>
    stack.length > 0 ? stack[stack.length - 1].children : root;

  while ((match = tagRegex.exec(text)) !== null) {
    const [fullMatch, isClosing, rawTagName, param] = match;
    const tagName = rawTagName.toLowerCase();
    const matchIndex = match.index;

    // Plain text before this tag
    if (matchIndex > lastIndex) {
      currentChildren().push({
        type: "text",
        value: text.slice(lastIndex, matchIndex),
      });
    }
    lastIndex = matchIndex + fullMatch.length;

    if (isClosing) {
      // [br] is a void tag and is never pushed to the stack, so a
      // stray [/br] has nothing to close. Ignore it instead of
      // printing it as literal text.
      if (tagName === "br") {
        continue;
      }
      // Find matching tag in open stack
      let foundIndex = -1;
      for (let i = stack.length - 1; i >= 0; i--) {
        const openTag = stack[i].tag;
        if (
          openTag === tagName ||
          (tagName === "color" && (openTag === "color" || openTag in COLOR_MAP)) ||
          (tagName === "align" && (openTag === "align" || ["justify", "center", "right", "left"].includes(openTag)))
        ) {
          foundIndex = i;
          break;
        }
      }

      if (foundIndex !== -1) {
        while (stack.length > foundIndex + 1) {
          const popped = stack.pop()!;
          stack[stack.length - 1].children.push({
            type: "tag",
            tag: popped.tag,
            param: popped.param,
            children: popped.children,
          });
        }
        const target = stack.pop()!;
        currentChildren().push({
          type: "tag",
          tag: target.tag,
          param: target.param,
          children: target.children,
        });
      } else {
        currentChildren().push({ type: "text", value: fullMatch });
      }
    } else {
      // Opening tag
      if (tagName === "br") {
        // [br] is a void / self-closing tag, like <br /> in HTML.
        // It must NOT be pushed onto the stack: the old code pushed
        // it, so all text after [br] became children of the br node,
        // and renderAST discards br children, so that text vanished.
        // Emit it immediately so "A[br]B" renders A, a break, then B,
        // and "[br][br]" renders two breaks.
        currentChildren().push({
          type: "tag",
          tag: "br",
          children: [],
        });
      } else if (SUPPORTED_TAGS.has(tagName)) {
        stack.push({
          tag: tagName,
          param: param?.trim(),
          children: [],
        });
      } else {
        currentChildren().push({ type: "text", value: fullMatch });
      }
    }
  }

  if (lastIndex < text.length) {
    currentChildren().push({
      type: "text",
      value: text.slice(lastIndex),
    });
  }

  // Unclosed tags popped back to root
  while (stack.length > 0) {
    const popped = stack.pop()!;
    if (stack.length > 0) {
      stack[stack.length - 1].children.push({
        type: "tag",
        tag: popped.tag,
        param: popped.param,
        children: popped.children,
      });
    } else {
      root.push({
        type: "tag",
        tag: popped.tag,
        param: popped.param,
        children: popped.children,
      });
    }
  }

  return root;
}

/**
 * Recursively converts AST nodes into React Virtual DOM elements.
 */
function renderAST(nodes: ASTNode[], parentKey = "fmt"): ReactNode[] {
  return nodes.map((node, idx) => {
    const key = `${parentKey}-${idx}`;
    if (node.type === "text") {
      return node.value ?? "";
    }

    const children = node.children && node.children.length > 0 ? renderAST(node.children, key) : null;
    const tag = node.tag?.toLowerCase() ?? "";

    if (COLOR_MAP[tag]) {
      return (
        <span key={key} className={COLOR_MAP[tag]}>
          {children}
        </span>
      );
    }

    switch (tag) {
      case "b":
      case "bold":
        return (
          <strong key={key} className="font-bold text-white">
            {children}
          </strong>
        );
      case "i":
      case "italic":
      case "em":
        return (
          <em key={key} className="italic">
            {children}
          </em>
        );
      case "u":
      case "underline":
        return (
          <span key={key} className="underline underline-offset-4 decoration-accent/60">
            {children}
          </span>
        );
      case "color": {
        const c = node.param || "inherit";
        return (
          <span key={key} style={{ color: c }}>
            {children}
          </span>
        );
      }
      case "badge":
      case "highlight":
        return (
          <span
            key={key}
            className="inline-block rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-accent mx-0.5 align-middle"
          >
            {children}
          </span>
        );
      case "code":
        return (
          <code
            key={key}
            className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-yellow-300"
          >
            {children}
          </code>
        );
      case "justify":
        return (
          <span key={key} className="block text-justify leading-relaxed">
            {children}
          </span>
        );
      case "center":
        return (
          <span key={key} className="block text-center">
            {children}
          </span>
        );
      case "right":
        return (
          <span key={key} className="block text-right">
            {children}
          </span>
        );
      case "left":
        return (
          <span key={key} className="block text-left">
            {children}
          </span>
        );
      case "align": {
        const align = node.param?.toLowerCase();
        const alignClass =
          align === "center"
            ? "text-center"
            : align === "right"
            ? "text-right"
            : align === "justify"
            ? "text-justify leading-relaxed"
            : "text-left";
        return (
          <span key={key} className={`block ${alignClass}`}>
            {children}
          </span>
        );
      }
      case "br":
        return <br key={key} />;
      case "p":
        return (
          <p key={key} className="my-3 leading-relaxed">
            {children}
          </p>
        );
      default:
        return <React.Fragment key={key}>{children}</React.Fragment>;
    }
  });
}

/**
 * Universal FormattedText Component.
 * Supports: [b], [i], [u], [x]/[yellow], [red], [green], [blue], [cyan], [purple], [white],
 * [color=#...], [badge], [code], [justify], [center], [right], [left], [br], [p].
 */
export function FormattedText({
  text,
  className,
  as: Component = "span",
}: {
  text?: string;
  className?: string;
  as?: ElementType;
}) {
  if (!text) return null;
  const ast = parseFormattedText(text);
  return <Component className={className}>{renderAST(ast)}</Component>;
}

/**
 * Convenience inline format helper.
 */
export function formatText(text?: string, defaultClass?: string): ReactNode {
  if (!text) return null;
  const ast = parseFormattedText(text);
  const rendered = renderAST(ast);
  if (defaultClass) {
    return <span className={defaultClass}>{rendered}</span>;
  }
  return <>{rendered}</>;
}

export default FormattedText;
