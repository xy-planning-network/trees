import {
  h,
  computed,
  type VNode,
  type VNodeArrayChildren,
  type MaybeRef,
  toValue,
} from "vue"
import { marked, type Token, type Tokens } from "marked"

type RenderableNode = VNode | string | VNodeArrayChildren

export function useInlineMarkdown(markdown: MaybeRef<string>) {
  const getNestedTokens = (token: Token): Token[] => {
    return "tokens" in token && Array.isArray(token.tokens) ? token.tokens : []
  }

  const renderTokens = (tokens: Token[]): RenderableNode | RenderableNode[] => {
    if (!tokens || tokens.length === 0) return []

    // NOTE(spk): a flat map guarantees no paragraphs.  Is that what we want?
    return tokens.flatMap((token): RenderableNode | RenderableNode[] => {
      switch (token.type) {
        // Plain text including escaped characters
        case "text":
        case "escape":
          return token.text

        // Bold **text** or __text__
        case "strong":
          return h("strong", renderTokens(getNestedTokens(token)))

        // Italic *text* or _text_
        case "em":
          return h("em", renderTokens(getNestedTokens(token)))

        // Strikethrough ~~text~~
        case "del":
          return h("del", renderTokens(getNestedTokens(token)))

        // Inline Code `text`
        case "codespan":
          return h("code", token.text)

        // Hyperlinks [text](url)
        // TODO(spk): no origin is internal, different origin is external
        // rel='noopener noreferrer' and target='_blank'
        case "link": {
          const linkToken = token as Tokens.Link
          return h(
            "a",
            {
              class: "xy-link",
              href: linkToken.href,
            },
            renderTokens(getNestedTokens(linkToken))
          )
        }

        // Line Breaks \n
        case "br":
          return h("br")

        // --- Structural Tokens ---
        // 'marked' wraps root text in paragraphs. We convert them to <span> to remain inline.
        case "paragraph":
          return renderTokens(getNestedTokens(token))

        case "space":
          return " "

        // Fallback: Safely render raw characters for unsupported elements (tables, lists, etc.)
        default:
          return token.raw || ""
      }
    })
  }

  // The composable returns a computed property containing the Render Function.
  // This allows it to reactively update if the underlying textRef changes.
  return computed(() => {
    const unformatted = toValue(markdown)

    if (!unformatted) return () => null

    const tokens = marked.lexer(unformatted)

    return () => renderTokens(tokens)
  })
}
