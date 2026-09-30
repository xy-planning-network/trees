import {
  h,
  computed,
  type VNode,
  type VNodeArrayChildren,
  toValue,
  type MaybeRefOrGetter,
  type ComputedRef,
} from "vue"
import { marked, type Token, type Tokens } from "marked"

export type MarkdownNode = VNode | string | VNodeArrayChildren

export interface InlineMarkdownConfig {
  graphs: boolean
}

export type UseInlineMarkdown = ComputedRef<
  (() => null) | (() => MarkdownNode | MarkdownNode[])
>

/**
 * Creates a Vue render function for a subset of Markdown.
 *
 * `marked` is used only to tokenize the source. We parse those
 * tokens and map supported syntax to VNodes instead of rendering and
 * injecting HTML - this allows Vue to continue to do the sanitizing.
 *
 * Unsupported tokens, including raw HTML, remain plain text and
 * are escaped by Vue.
 *
 * Enable `graphs` to preserve paragraph wrappers; otherwise
 * all contents are rendered inline.
 */
export function useInlineMarkdown(
  markdown: MaybeRefOrGetter<string>,
  conf?: InlineMarkdownConfig
): UseInlineMarkdown {
  const config: InlineMarkdownConfig = {
    ...{
      graphs: false,
    },
    ...(conf || {}),
  }

  const getLinkAttributes = (href: string) => {
    try {
      const url = new URL(href, window.location.href)

      if (!["http:", "https:", "mailto:", "tel:"].includes(url.protocol)) {
        return {}
      }

      const isExternal = url.origin !== window.location.origin

      return {
        href,
        rel: isExternal ? "noopener" : undefined,
        target: isExternal ? "_blank" : undefined,
      }
    } catch {
      return {}
    }
  }

  const getNestedTokens = (token: Token): Token[] => {
    return "tokens" in token && Array.isArray(token.tokens) ? token.tokens : []
  }

  const render = (tokens: Token[]): MarkdownNode | MarkdownNode[] => {
    if (!tokens || tokens.length === 0) return []

    return tokens.flatMap((token): MarkdownNode | MarkdownNode[] => {
      switch (token.type) {
        // Plain text including escaped characters
        case "text":
        case "escape":
          return token.text

        // Bold **text** or __text__
        case "strong":
          return h("strong", render(getNestedTokens(token)))

        // Italic *text* or _text_
        case "em":
          return h("em", render(getNestedTokens(token)))

        // Strikethrough ~~text~~
        case "del":
          return h("del", render(getNestedTokens(token)))

        // Inline Code `text`
        case "codespan":
          return h("code", token.text)

        // Hyperlinks [text](url)
        // NOTE(spk): (experimental): external links are opened in a new window always
        case "link": {
          const linkToken = token as Tokens.Link
          return h(
            "a",
            {
              class: "xy-link",
              ...getLinkAttributes(linkToken.href),
            },
            render(getNestedTokens(linkToken))
          )
        }

        // graphs created by markdown line breaks
        case "paragraph": {
          const children = render(getNestedTokens(token))
          return config.graphs ? h("p", children) : children
        }

        // NOTE(spk): all other tokens and html are render as raw characters which will be escaped by Vue.
        default:
          return token.raw || ""
      }
    })
  }

  return computed(() => {
    const unformatted = toValue(markdown)

    if (!unformatted) {
      return () => null
    }

    const tokens = marked.lexer(unformatted)

    return () => render(tokens)
  })
}
