import { useEffect, useRef, useState, useId, type ComponentProps, type CSSProperties, type ReactNode } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume, VolumeOff } from "@matrixzero/icons";
import { cx, IconButton, useFieldProps } from "./controls.js";
export interface SliderProps extends Omit<ComponentProps<"input">, "type" | "value" | "defaultValue" | "size"> {
	value?: number | string;
	defaultValue?: number;
	onValueChange?: (value: number) => void;
	label?: ReactNode;
	showValue?: boolean;
	formatValue?: (value: number) => string;
}
export function Slider({
	value,
	defaultValue = 0,
	onValueChange,
	label,
	showValue = true,
	formatValue = String,
	min = 0,
	max = 100,
	step = 1,
	className,
	onChange,
	...props
}: SliderProps) {
	const field = useFieldProps(props);
	const auto = useId();
	const id = field.id ?? auto;
	const [internal, setInternal] = useState(defaultValue);
	const ref = useRef<HTMLInputElement>(null);
	const current = Number(value ?? internal);
	const lo = Number(min),
		hi = Number(max);
	const percent = hi > lo ? Math.max(0, Math.min(100, ((current - lo) / (hi - lo)) * 100)) : 0;
	useEffect(() => {
		const f = ref.current?.form;
		const reset = (e: Event) =>
			queueMicrotask(() => {
				if (!e.defaultPrevented && value === undefined) setInternal(defaultValue);
			});
		f?.addEventListener("reset", reset);
		return () => f?.removeEventListener("reset", reset);
	}, [defaultValue, value]);
	return (
		<div className={cx("mds-slider", className)} style={{ "--mds-slider-progress": `${percent}%` } as CSSProperties}>
			{(label || showValue) && (
				<div className="mds-slider-label">
					{label && (
						<label htmlFor={id} className="mds-label">
							{label}
						</label>
					)}
					{showValue && <output htmlFor={id}>{formatValue(current)}</output>}
				</div>
			)}
			<input
				{...props}
				{...field}
				id={id}
				ref={ref}
				type="range"
				min={min}
				max={max}
				step={step}
				value={current}
				aria-valuetext={formatValue(current)}
				onChange={(e) => {
					onChange?.(e);
					const next = e.target.valueAsNumber;
					if (value === undefined) setInternal(next);
					onValueChange?.(next);
				}}
			/>
		</div>
	);
}
export interface AudioPlayerProps {
	src: string;
	title: string;
	artist?: string;
	artwork?: ReactNode;
	locale?: "en" | "zh";
	labels?: Partial<
		Record<"player" | "play" | "pause" | "previous" | "next" | "seek" | "volume" | "mute" | "unmute" | "error", string>
	>;
	onNext?: () => void;
	onPrevious?: () => void;
	onEnded?: () => void;
	className?: string;
}
const timestamp = (value: number) => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, "0")}`;
/** Custom controls for a real HTML audio element. Never autoplays. */
export function AudioPlayer({
	src,
	title,
	artist,
	artwork,
	locale = "en",
	labels,
	onNext,
	onPrevious,
	onEnded,
	className,
}: AudioPlayerProps) {
	const audio = useRef<HTMLAudioElement>(null);
	const [playing, setPlaying] = useState(false);
	const [duration, setDuration] = useState(0);
	const [position, setPosition] = useState(0);
	const [volume, setVolume] = useState(0.7);
	const [muted, setMuted] = useState(false);
	const [error, setError] = useState(false);
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	const syncDuration = (el: HTMLAudioElement) => {
		const next = Number.isFinite(el.duration) ? el.duration : 0;
		if (next > 0 && Number.isFinite(next)) {
			setDuration(next);
		}
	};
	useEffect(() => {
		setPlaying(false);
		setPosition(0);
		setDuration(0);
		setError(false);
	}, [src]);
	useEffect(() => {
		const el = audio.current;
		if (!el) return;
		const onMeta = () => syncDuration(el);
		const onLoaded = () => syncDuration(el);
		const onCanPlay = () => syncDuration(el);
		const onDurationChange = () => syncDuration(el);
		el.addEventListener("loadedmetadata", onMeta);
		el.addEventListener("loadeddata", onLoaded);
		el.addEventListener("durationchange", onDurationChange);
		el.addEventListener("canplay", onCanPlay);
		syncDuration(el);
		return () => {
			el.removeEventListener("loadedmetadata", onMeta);
			el.removeEventListener("loadeddata", onLoaded);
			el.removeEventListener("durationchange", onDurationChange);
			el.removeEventListener("canplay", onCanPlay);
		};
	}, [src]);
	useEffect(() => {
		if (audio.current) {
			audio.current.volume = volume;
			audio.current.muted = muted;
		}
	}, [volume, muted, src]);
	const toggle = async () => {
		const el = audio.current;
		if (!el) return;
		if (!el.paused) {
			el.pause();
			return;
		}
		setError(false);
		try {
			await el.play();
		} catch {
			setError(true);
		}
	};
	return (
		<section
			className={cx("mds-audio-player", className)}
			aria-label={labels?.player ?? t("音频播放器", "Audio player")}
		>
			<audio
				ref={audio}
				src={src}
				preload="auto"
				onTimeUpdate={(e) => setPosition(e.currentTarget.currentTime)}
				onPlay={() => setPlaying(true)}
				onPause={() => setPlaying(false)}
				onEnded={() => {
					setPlaying(false);
					onEnded?.();
				}}
				onError={() => {
					setPlaying(false);
					setError(true);
				}}
			/>
			<div className="mds-audio-meta">
				{artwork && (
					<div className="mds-audio-art" aria-hidden="true">
						{artwork}
					</div>
				)}
				<div>
					<strong>{title}</strong>
					{artist && <p>{artist}</p>}
				</div>
			</div>
			<div className="mds-audio-transport">
				<IconButton
					label={labels?.previous ?? t("上一首", "Previous track")}
					icon={<SkipBack />}
					variant="ghost"
					disabled={!onPrevious}
					onClick={onPrevious}
				/>
				<IconButton
					label={playing ? (labels?.pause ?? t("暂停", "Pause")) : (labels?.play ?? t("播放", "Play"))}
					icon={playing ? <Pause /> : <Play />}
					variant="primary"
					shape="pill"
					onClick={toggle}
				/>
				<IconButton
					label={labels?.next ?? t("下一首", "Next track")}
					icon={<SkipForward />}
					variant="ghost"
					disabled={!onNext}
					onClick={onNext}
				/>
			</div>
			<div className="mds-audio-seek">
				<span aria-hidden="true">{timestamp(position)}</span>
				<Slider
					aria-label={labels?.seek ?? t("播放进度", "Playback position")}
					value={position}
					max={duration || 1}
					step={0.1}
					showValue={false}
					disabled={!duration || error}
					formatValue={timestamp}
					onValueChange={(value) => {
						if (audio.current) {
							audio.current.currentTime = value;
							setPosition(value);
						}
					}}
				/>
				<span aria-hidden="true">{timestamp(duration)}</span>
			</div>
			<div className="mds-audio-volume">
				<IconButton
					label={muted ? (labels?.unmute ?? t("取消静音", "Unmute")) : (labels?.mute ?? t("静音", "Mute"))}
					icon={muted || volume === 0 ? <VolumeOff /> : <Volume />}
					variant="ghost"
					aria-pressed={muted}
					onClick={() => setMuted(!muted)}
				/>
				<Slider
					aria-label={labels?.volume ?? t("音量", "Volume")}
					value={muted ? 0 : volume * 100}
					showValue={false}
					formatValue={(value) => `${Math.round(value)}%`}
					onValueChange={(value) => {
						setVolume(value / 100);
						setMuted(false);
					}}
				/>
			</div>
			{error && (
				<p role="alert" className="mds-error">
					{labels?.error ??
						t("无法播放此音频，请检查音源后重试。", "Unable to play this audio. Check the source and try again.")}
				</p>
			)}
		</section>
	);
}
