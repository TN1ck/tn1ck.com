import hljs from "highlight.js/lib/core"
import go from "highlight.js/lib/languages/go"
hljs.registerLanguage("go", go)

export function CodeBlock({
  children,
  language,
}: {
  children: string
  language: string
}) {
  const myHtml = hljs.highlight(children.trim(), { language }).value
  return (
    <pre
      className="hljs p-4 overflow-scroll"
      dangerouslySetInnerHTML={{ __html: myHtml }}
    ></pre>
  )
}
