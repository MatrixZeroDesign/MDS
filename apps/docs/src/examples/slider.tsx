import { useState } from "react";
import { Field, Slider } from "@matrixzero/ui";

export default function Example({ locale = "zh" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	const [volume, setVolume] = useState(50);
	return (
		<Field label={`${t("音量", "Volume")}: ${volume}%`}>
			<Slider
				min={0}
				max={100}
				step={1}
				value={volume}
				onChange={(e) => setVolume(e.target.valueAsNumber)}
				aria-valuetext={`${volume}%`}
			/>
		</Field>
	);
}
