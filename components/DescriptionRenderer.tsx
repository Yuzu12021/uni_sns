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
              className="font-semibold text-blue-600 underline underline-offset-2 hover:text-blue-700"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
  <img
    src={src || ""}
    alt={alt || "投稿画像"}
    className="my-4 max-h-[520px] max-w-full rounded-2xl border object-contain shadow-sm"
  />
),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}