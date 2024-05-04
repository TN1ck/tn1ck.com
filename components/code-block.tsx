import hljs from "highlight.js/lib/core"
import go from "highlight.js/lib/languages/go"
import plaintext from "highlight.js/lib/languages/plaintext"
import xml from "highlight.js/lib/languages/xml"
import typescript from "highlight.js/lib/languages/typescript"
import css from "highlight.js/lib/languages/css"
import clsx from "clsx"
hljs.registerLanguage("go", go)
hljs.registerLanguage("plaintext", plaintext)
hljs.registerLanguage("xml", xml)
hljs.registerLanguage("typescript", typescript)
hljs.registerLanguage("css", css)

export function CodeBlock({
  children,
  language,
  className,
}: {
  children: string
  language: string
  className?: string
}) {
  const myHtml = hljs.highlight(children.trim(), { language }).value
  return (
    <pre
      className={clsx("hljs p-4 overflow-scroll", className)}
      dangerouslySetInnerHTML={{ __html: myHtml }}
    ></pre>
  )
}
