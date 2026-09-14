import remaining from "./remaining-messages.json";
import catalogMessages from "./catalog-messages.json";
import page from "./page-messages.json";
import examples from "./example-messages.json";
import guideAr from "./guide-ar-messages.json";
import { Converter } from "opencc-js/cn2t";
import messages from "./messages.json";
import guides from "./guide-messages.json";
import extraGuides from "./guide-extra-messages.json";
import home from "./home-messages.json";
import components from "./component-messages.json";
export type DocsLocale = "en" | "zh" | "zh-TW" | "ja" | "ko" | "fr" | "es" | "ar";
export const languages: { value: DocsLocale; label: string; tag: string }[] = [
	{ value: "en", label: "English", tag: "en" },
	{ value: "zh", label: "简体中文", tag: "zh-CN" },
	{ value: "zh-TW", label: "繁體中文", tag: "zh-TW" },
	{ value: "ja", label: "日本語", tag: "ja" },
	{ value: "ko", label: "한국어", tag: "ko" },
	{ value: "fr", label: "Français", tag: "fr" },
	{ value: "es", label: "Español", tag: "es" },
	{ value: "ar", label: "العربية", tag: "ar" },
];
export function isDocsLocale(value: unknown): value is DocsLocale {
	return languages.some((item) => item.value === value);
}
export function languageTag(locale: DocsLocale) {
	return languages.find((item) => item.value === locale)!.tag;
}
const traditional = Converter({ from: "cn", to: "tw" });
const catalog = {
	...messages,
	...guides,
	...extraGuides,
	...guideAr,
	...home,
	...page,
	...examples,
	...catalogMessages,
	...remaining,
	...components,
} as Record<string, string[]>;
const index = { ja: 0, ko: 1, fr: 2, es: 3, ar: 4 } as const;
export function translate(locale: DocsLocale, zh: string, en: string) {
	if (locale === "zh") return zh;
	if (locale === "zh-TW") return traditional(zh);
	if (locale === "en") return en;
	return catalog[en]?.[index[locale]] ?? en;
}
export function translatePair(locale: DocsLocale, values: readonly string[]) {
	return translate(locale, values[0] ?? "", values[1] ?? values[0] ?? "");
}
export function translateProse(locale: DocsLocale, value: string) {
	const parts = value.split(" / ");
	return translate(locale, parts[0], parts[1] ?? parts[0]);
}

export function audioLabels(locale: DocsLocale) {
	return {
		player: translate(locale, "音频播放器", "AudioPlayer"),
		play: translate(locale, "播放", "Play"),
		pause: translate(locale, "暂停", "Pause"),
		previous: translate(locale, "上一首", "Previous"),
		next: translate(locale, "下一首", "Next"),
		seek: translate(locale, "播放位置", "Playback position"),
		volume: translate(locale, "音量", "Volume"),
		mute: translate(locale, "静音", "Mute"),
		unmute: translate(locale, "取消静音", "Unmute"),
		error: translate(locale, "无法加载音频", "Unable to load audio"),
	};
}
