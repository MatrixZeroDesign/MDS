import { audioLabels, type DocsLocale, translate } from "../../i18n";
import { AudioPlayer } from "@matrixzero/ui";
export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	return (
		<AudioPlayer
			labels={audioLabels(locale)}
			src="/audio/track-2.wav"
			title={translate(locale, "晨光", "Morning Light")}
			artist={translate(locale, "MDS 原创合成示例", "MDS original synthesized sample")}
			locale={locale === "zh" || locale === "zh-TW" ? "zh" : "en"}
		/>
	);
}
