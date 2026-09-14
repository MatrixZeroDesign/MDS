import { type DocsLocale, translate } from "../../i18n";
import { useState } from "react";
import { ChoiceMenu, Field, Select, Button } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const [sort, setSort] = useState("recent");
	const items = sort === "recent" ? ["Matrix", "Atlas"] : ["Atlas", "Matrix"];
	return (
		<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))", gap: 32 }}>
			<section aria-label="ChoiceMenu">
				<h4 style={{ margin: "0 0 16px" }}>ChoiceMenu</h4>
				<div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
					<span>{t("排序", "Sort")}</span>
					<ChoiceMenu
						disabled
						label={t("排序方式", "Sort order")}
						value={sort}
						onValueChange={setSort}
						options={[
							{ value: "recent", label: t("最近更新", "Recently updated") },
							{ value: "name", label: t("名称顺序", "Name A–Z") },
						]}
					/>
				</div>
				<ul style={{ margin: "16px 0", paddingInlineStart: 20 }}>
					{items.map((item) => (
						<li key={item}>{item}</li>
					))}
				</ul>
				<p style={{ margin: 0 }}>
					{t("立即改变当前视图，无需提交表单。", "Updates this view immediately, without submitting a form.")}
				</p>
			</section>
			<section aria-label="Select">
				<h4 style={{ margin: "0 0 16px" }}>Select</h4>
				<form style={{ display: "grid", gap: 16 }}>
					<Field label={t("地区", "Region")} required>
						<Select
							name="region"
							defaultValue="asia"
							options={[
								{ value: "asia", label: t("亚洲", "Asia") },
								{ value: "europe", label: t("欧洲", "Europe") },
							]}
						/>
					</Field>
					<Button type="reset" style={{ justifySelf: "start" }}>
						{t("重置", "Reset")}
					</Button>
				</form>
				<p style={{ margin: "16px 0 0" }}>
					{t("填写表单值，支持必填校验与重置。", "A form value with required validation and reset support.")}
				</p>
			</section>
		</div>
	);
}
