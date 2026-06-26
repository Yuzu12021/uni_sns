import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

type DescriptionRendererProps = {
  content: string;
};

export default function DescriptionRenderer({
  content,
}: DescriptionRendererProps) {
  return (
    <div className="prose max-w-none text-slate-700">
      <ReactMarkdown
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[rehypeSanitize]}
  components={{
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="
          text-blue-600
          font-semibold
          underline
          underline-offset-2
          hover:text-blue-700
        "
      >
        {children}
      </a>
    ),
  }}
>
  {content}
</ReactMarkdown>
    </div>
  );
}