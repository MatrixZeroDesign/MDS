import { audioLabels } from "../i18n";
import { useState } from "react";
import { Button, IconButton, Table, Badge, AudioPlayer } from "@matrixzero/ui";
import { Heart } from "@matrixzero/icons";
import { Panel, translator, type SceneProps } from "./shared";
export default function Music({ locale }: SceneProps) {
	const t = translator(locale);
	const [track, setTrack] = useState(0);

	const [liked, setLiked] = useState<number[]>([]);
	const tracks = [t("晨光", "Morning Light"), t("蓝色时刻", "Blue Hour"), t("回家的路", "The Way Home")];
	return (
		<div className="sc-stack">
			<div className="sc-album">
				<div className="sc-record" aria-hidden="true">
					<span />
				</div>
				<div>
					<Badge>{t("精选歌单", "Curated playlist")}</Badge>
					<h2>{t("给自己一点空间", "A little room to breathe")}</h2>
					<p>{t("三段旋律，陪伴一段安静时光。", "Three tracks for a quieter moment.")}</p>
					<p className="docs-muted">
						{t(
							"包含三段原创合成音频，可实际播放和拖动进度。",
							"Three original synthesized samples with real playback and seeking.",
						)}
					</p>
				</div>
			</div>
			<Panel title={t("播放列表", "Track list")}>
				<Table>
					<thead>
						<tr>
							<th>{t("曲目", "Track")}</th>
							<th>{t("时长", "Duration")}</th>
							<th>{t("收藏", "Favorite")}</th>
						</tr>
					</thead>
					<tbody>
						{tracks.map((title, i) => (
							<tr key={title}>
								<th scope="row">
									<Button
										variant={track === i ? "secondary" : "ghost"}
										aria-pressed={track === i}
										onClick={() => {
											setTrack(i);
										}}
									>
										{i + 1}. {title}
									</Button>
								</th>
								<td>{["0:16", "0:16", "0:16"][i]}</td>
								<td>
									<IconButton
										label={`${t("收藏", "Favorite")} ${title}`}
										aria-pressed={liked.includes(i)}
										variant="ghost"
										icon={<Heart variant={liked.includes(i) ? "filled" : "outlined"} />}
										onClick={() => setLiked(liked.includes(i) ? liked.filter((x) => x !== i) : [...liked, i])}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			</Panel>
			<AudioPlayer
				labels={audioLabels(locale)}
				src={`/audio/track-${track + 1}.wav`}
				title={tracks[track]}
				artist={t("MDS 原创合成示例", "MDS original synthesized sample")}
				locale={locale === "zh" || locale === "zh-TW" ? "zh" : "en"}
				onPrevious={() => setTrack((track + 2) % 3)}
				onNext={() => setTrack((track + 1) % 3)}
			/>
		</div>
	);
}
