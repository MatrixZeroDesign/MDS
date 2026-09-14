import { useState } from "react";
import { Check } from "@matrixzero/icons";
import {
	Button,
	DropdownContent,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	ThemeProvider,
	type ThemePalette,
} from "@matrixzero/ui";
import { type DocsLocale, translate } from "../../i18n";

const options: { value: ThemePalette; zh: string; en: string }[] = [
	{ value: "mint", zh: "薄荷", en: "Mint" },
	{ value: "blue", zh: "蓝色", en: "Blue" },
	{ value: "rose", zh: "玫瑰", en: "Rose" },
];

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const [selected, setSelected] = useState<ThemePalette>("mint");
	return (
		<DropdownMenu>
			<DropdownTrigger asChild>
				<Button>{t("选择主题", "Choose theme")}</Button>
			</DropdownTrigger>
			<DropdownContent className="docs-rich-theme-menu">
				{options.map((option) => (
					<DropdownItem
						key={option.value}
						className="docs-rich-theme-option"
						role="menuitemradio"
						aria-checked={selected === option.value}
						aria-label={t(option.zh, option.en)}
						data-selected={selected === option.value || undefined}
						onSelect={() => setSelected(option.value)}
					>
						<span className="docs-rich-theme-preview" aria-hidden="true">
							{(["light", "dark"] as const).map((mode) => (
								<ThemeProvider key={mode} palette={option.value} mode={mode}>
									<i />
									<b />
									<em />
								</ThemeProvider>
							))}
						</span>
						<span className="docs-rich-theme-copy">
							<strong>{t(option.zh, option.en)}</strong>
							<small>{t("浅色与深色预览", "Light and dark preview")}</small>
						</span>
						<span className="docs-rich-theme-check" aria-hidden="true">
							{selected === option.value && <Check size={15} />}
						</span>
					</DropdownItem>
				))}
			</DropdownContent>
		</DropdownMenu>
	);
}
