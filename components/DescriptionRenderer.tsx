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
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}