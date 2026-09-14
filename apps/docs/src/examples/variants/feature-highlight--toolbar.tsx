import { type DocsLocale, translate } from "../../i18n";
import { useState } from "react";
import { FeatureHighlight, IconButton } from "@matrixzero/ui";
import { Copy, Share, Download } from "@matrixzero/icons";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const [unseen, setUnseen] = useState(true);
	const [message, setMessage] = useState("");
	return (
		<div style={{ display: "grid", gap: 24 }}>
			<div
				role="group"
				aria-label={t("文档操作", "Document actions")}
				style={{ display: "flex", flexWrap: "wrap", gap: 16, padding: 8 }}
			>
				<IconButton
					label={t("复制文档", "Duplicate document")}
					icon={<Copy />}
					onClick={() => setMessage(t("已创建示例副本", "Demo copy created"))}
				/>
				<FeatureHighlight active={unseen}>
					<IconButton
						label={t("分享文档（新功能）", "Share document (new)")}
						icon={<Share />}
						onClick={() => {
							setUnseen(false);
							setMessage(t("分享入口已发现，提示已关闭。", "Share action discovered. Hint dismissed."));
						}}
					/>
				</FeatureHighlight>
				<IconButton
					label={t("导出文档", "Export document")}
					icon={<Download />}
					onClick={() => setMessage(t("示例导出已准备好", "Demo export prepared"))}
				/>
			</div>
			<p role="status">
				{message || t("用轻量提示突出工具栏中新增加的操作。", "Draw attention to a newly added toolbar action.")}
			</p>
		</div>
	);
}
