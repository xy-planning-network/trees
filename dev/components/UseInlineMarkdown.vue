<script setup lang="ts">
import type { TableColumns } from "@/composables"
import { useInlineMarkdown } from "@/composables/useInlineMarkdown"
import { computed, h } from "vue"

const tableData = [
  { option: "Plain text", markdown: "Plain text" },
  {
    option: "Escaped characters",
    markdown: String.raw`\*Literal asterisks\*`,
  },
  { option: "Bold (asterisks)", markdown: "**Bold text**" },
  { option: "Bold (underscores)", markdown: "__Bold text__" },
  { option: "Italic (asterisk)", markdown: "*Italic text*" },
  { option: "Italic (underscore)", markdown: "_Italic text_" },
  { option: "Strikethrough", markdown: "~~Strikethrough text~~" },
  { option: "Inline code", markdown: "`Code text`" },
  {
    option: "Hyperlink (Internal)",
    markdown: "[Homepage](/trees/)",
  },
  {
    option: "Hyperlink (External)",
    markdown: "[XYPN Homepage](https://www.xyplanningnetwork.com/)",
  },
  {
    option: "HTML (rendered as text)",
    markdown: `<a href="javascript:alert('XSS')">Click me!</a>`,
  },
].map((example) => ({
  ...example,
  rendered: useInlineMarkdown(example.markdown),
}))

type MarkdownExample = (typeof tableData)[number]

const tableColumns: TableColumns<MarkdownExample> = [
  { title: "Option", render: "option" },
  { title: "Markdown", classNames: "font-mono", render: "markdown" },
  {
    title: "Rendered",
    render: ({ rendered }) => h(rendered.value),
  },
]

const graphTest = computed(() => {
  const graphs = [
    "This markdown string creates two paragraph tags using two newline escape sequences - `\\n\\n` - __this is the preferred syntax__.\n\n This is the second paragraph...",
    `This markdown string creates two paragraph tags using literal newlines - this doesn't work well in schemas, props, etc - avoid it.

This is the second paragraph...`,
  ]

  return graphs.map((s) => {
    return useInlineMarkdown(s, { graphs: true }).value
  })
})
</script>

<template>
  <ComponentLayout :show-badge="false" title="useInlineMarkdown">
    <template #description>
      Renders a safe subset of inline Markdown including emphasis,
      strikethrough, code, and links as Vue nodes.
    </template>

    <DataTable :table-columns="tableColumns" :table-data="tableData" />

    <div class="mt-8 prose-sm space-y-8">
      <h3>Paragraph support - use with caution.</h3>

      <template v-for="(markdown, idx) in graphTest" :key="idx">
        <h5>Graph Style {{ idx + 1 }}</h5>
        <component :is="markdown" />
      </template>
    </div>

    <UseInlineMarkdownDocs />
  </ComponentLayout>
</template>
