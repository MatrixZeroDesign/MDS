import { standaloneExample } from "./i18n/exampleSource";
import { type DocsLocale, translate } from "./i18n";
import { useId, useState } from "react";
import { IconButton, Tooltip, TooltipProvider } from "@matrixzero/ui";
import { Code, Copy, Check, RotateLeft } from "@matrixzero/icons";

const tokenPattern =
	/(\/\*[\s\S]*?\*\/|\/\/[^\n]*|`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|<\/?[A-Z][\w.]*|\b(?:as|async|await|break|case|catch|class|const|continue|default|else|export|extends|false|finally|for|from|function|if|import|in|instanceof|interface|keyof|let|new|null|of|return|satisfies|switch|throw|true|try|type|typeof|undefined|while)\b|\b\d+(?:\.\d+)?\b)/g;

function highlightTsx(source: string) {
	return source.split(tokenPattern).map((token, index) => {
		if (!token) return null;
		const kind =
			token.startsWith("//") || token.startsWith("/*")
				? "comment"
				: /^["'`]/.test(token)
					? "string"
					: /^<\/?[A-Z]/.test(token)
						? "tag"
						: /^\d/.test(token)
							? "number"
							: "keyword";
		return (
			<span className={`docs-code-${kind}`} key={index}>
				{token}
			</span>
		);
	});
}

export function ExampleCode({ code, locale, onReplay }: { code: string; locale: DocsLocale; onReplay?: () => void }) {
	code = standaloneExample(code, locale);
	const [open, setOpen] = useState(false);
	const [status, setStatus] = useState("");
	const [copied, setCopied] = useState(false);
	const id = useId();
	const codeLabel = translate(locale, "代码", "Code");
	const copyLabel = translate(locale, "复制代码", "Copy code");
	return (
		<div className="docs-example-code">
			<TooltipProvider>
				<div className="docs-example-code-actions">
					<Tooltip content={codeLabel}>
						<IconButton
							label={codeLabel}
							icon={<Code />}
							size="sm"
							variant="ghost"
							aria-expanded={open}
							aria-controls={id}
							onClick={() => setOpen(!open)}
						/>
					</Tooltip>
					<Tooltip content={copyLabel}>
						<IconButton
							label={copyLabel}
							icon={copied ? <Check /> : <Copy />}
							size="sm"
							variant="ghost"
							onClick={async () => {
								try {
									await navigator.clipboard.writeText(code);
									setCopied(true);
									setStatus(translate(locale, "已复制", "Copied"));
								} catch {
									setStatus(translate(locale, "请展开代码后手动复制", "Expand the code and copy manually"));
								}
							}}
						/>
					</Tooltip>
					{onReplay && (
						<Tooltip content={translate(locale, "重播动画", "Replay animation")}>
							<IconButton
								label={translate(locale, "重播动画", "Replay animation")}
								icon={<RotateLeft />}
								size="sm"
								variant="ghost"
								onClick={onReplay}
							/>
						</Tooltip>
					)}
					<span role="status">{status}</span>
				</div>
			</TooltipProvider>
			<div id={id} hidden={!open}>
				<pre>
					<code className="language-tsx" data-language="TSX">
						{highlightTsx(code)}
					</code>
				</pre>
			</div>
		</div>
	);
}
