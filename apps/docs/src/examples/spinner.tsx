import { type DocsLocale, translate } from "../i18n";
import { Spinner } from "@matrixzero/ui";
export default function Example({ locale = "en", size = "md" }: { locale?: DocsLocale; size?: "sm" | "md" | "lg" }) {
	return (
		<div style={{ display: "flex", gap: 12, alignItems: "center" }}>
			<Spinner size={size} label={translate(locale, "正在加载内容", "Loading content")} />
			<span>{translate(locale, "正在准备内容…", "Preparing your content…")}</span>
		</div>
	);
}
