import { useState } from "react";
import { Button, IconButton, Table, Badge } from "@matrixzero/ui";
import { Heart } from "@matrixzero/icons";
import { Panel, translator, type SceneProps } from "./shared";
export default function Music({ locale }: SceneProps) {
	const t = translator(locale);
	const [track, setTrack] = useState(0);
	const [playing, setPlaying] = useState(false);
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
						{t("播放器交互演示，不包含音频文件。", "Player interaction demo; no audio files are included.")}
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
											setPlaying(true);
										}}
									>
										{i + 1}. {title}
									</Button>
								</th>
								<td>{["3:42", "4:10", "2:56"][i]}</td>
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
			<div className="sc-player">
				<div aria-live="polite">
					<strong>{tracks[track]}</strong>
					<p>{playing ? t("正在播放 · 模拟状态", "Playing · simulated") : t("已暂停", "Paused")}</p>
				</div>
				<div className="sc-row">
					<Button variant="ghost" onClick={() => setTrack((track + 2) % 3)}>
						{t("上一首", "Previous")}
					</Button>
					<Button onClick={() => setPlaying(!playing)}>{playing ? t("暂停", "Pause") : t("播放", "Play")}</Button>
					<Button variant="ghost" onClick={() => setTrack((track + 1) % 3)}>
						{t("下一首", "Next")}
					</Button>
				</div>
			</div>
		</div>
	);
}
