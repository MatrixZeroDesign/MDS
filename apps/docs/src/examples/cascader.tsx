import { type DocsLocale, translate } from "../i18n";
import { useState } from "react";
import { Cascader } from "@matrixzero/ui";
export default function Example({
	locale = "en",
	changeOnSelect = false,
}: {
	locale?: DocsLocale;
	changeOnSelect?: boolean;
}) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const [value, setValue] = useState<string[]>([]);
	return (
		<Cascader
			label={t("选择地区", "Choose region")}
			placeholder={t("选择国家、省市", "Select a region")}
			clearLabel={t("清空", "Clear")}
			value={value}
			onValueChange={setValue}
			changeOnSelect={changeOnSelect}
			options={[
				{
					value: "china",
					label: t("中国", "China"),
					children: [
						{
							value: "zhejiang",
							label: t("浙江", "Zhejiang"),
							children: [
								{ value: "hangzhou", label: t("杭州", "Hangzhou") },
								{ value: "ningbo", label: t("宁波", "Ningbo") },
							],
						},
						{
							value: "jiangsu",
							label: t("江苏", "Jiangsu"),
							children: [
								{ value: "nanjing", label: t("南京", "Nanjing") },
								{ value: "suzhou", label: t("苏州", "Suzhou") },
							],
						},
					],
				},
				{
					value: "japan",
					label: t("日本", "Japan"),
					children: [
						{ value: "tokyo", label: t("东京", "Tokyo") },
						{ value: "osaka", label: t("大阪", "Osaka"), disabled: true },
					],
				},
			]}
		/>
	);
}
