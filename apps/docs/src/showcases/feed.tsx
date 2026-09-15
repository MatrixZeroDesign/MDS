import { ArrowUpRight } from "@matrixzero/icons";
import { translatePair } from "../i18n";
import { useState } from "react";
import {
	Card,
	CardContent,
	CardTitle,
	Avatar,
	Button,
	Chip,
	ChipGroup,
	IconButton,
	Input,
	EmptyState,
	Dialog,
	DialogContent,
} from "@matrixzero/ui";
import { Heart, Bookmark } from "@matrixzero/icons";
import { translator, type SceneProps } from "./shared";
import "./feed.css";

const posts = [
	{
		id: 1,
		category: "spaces",
		title: ["让阳光成为房间的一部分", "A little room for sunlight"],
		author: "Nora Chen",
		photo: "photo-1449247709967-d4461a6a6103",
		ratio: "4 / 5",
		likes: 248,
		note: [
			"木材、亚麻和午后的光。把空间留给喜欢的东西。",
			"Wood, linen, and afternoon light. Leaving space for the things that matter.",
		],
	},
	{
		id: 2,
		category: "travel",
		title: ["走进山里的周末", "The weekend, somewhere quieter"],
		author: "Alex Rivera",
		photo: "photo-1464822759023-fed622ff2c3b",
		ratio: "1 / 1",
		likes: 126,
		note: [
			"不赶路的一天。沿着山径走，停下来听风。",
			"A day without an itinerary. Follow the trail and stop to listen to the wind.",
		],
	},
	{
		id: 3,
		category: "food",
		title: ["一杯咖啡的时间", "Taking the slow way into morning"],
		author: "Mika Sato",
		photo: "photo-1442512595331-e89e73853f31",
		ratio: "3 / 4",
		likes: 392,
		note: ["手冲咖啡，打开窗户，开始新的一天。", "Freshly brewed coffee, an open window, and a new day ahead."],
	},
	{
		id: 4,
		category: "spaces",
		title: ["植物，也是一种陪伴", "A corner that keeps on growing"],
		author: "Sam Park",
		photo: "photo-1416879595882-3373a0480b5b",
		ratio: "4 / 5",
		likes: 87,
		note: [
			"从一盆植物开始，让家慢慢长成自己的样子。",
			"Start with one plant. Let your home grow into something that feels like you.",
		],
	},
	{
		id: 5,
		category: "travel",
		title: ["在海边，把时间放慢", "Where the day meets the sea"],
		author: "Lina Wu",
		photo: "photo-1476514525535-07fb3b4ae5f1",
		ratio: "4 / 3",
		likes: 513,
		note: [
			"水面上的倒影，是这趟旅行最想收藏的画面。",
			"Reflections on the water. The moment I wanted to bring home from this trip.",
		],
	},
	{
		id: 6,
		category: "food",
		title: ["今天，为自己认真做早餐", "Breakfast is a small occasion"],
		author: "Jamie Lee",
		photo: "photo-1490645935967-10de6ba17061",
		ratio: "1 / 1",
		likes: 204,
		note: [
			"新鲜食材，简单搭配。一顿不匆忙的早餐。",
			"Fresh ingredients, simple combinations. A breakfast with nowhere to rush.",
		],
	},
	{
		id: 7,
		category: "spaces",
		title: ["留一个安静阅读的角落", "One more chapter before sunset"],
		author: "Eva Miller",
		photo: "photo-1507842217343-583bb7270b66",
		ratio: "3 / 4",
		likes: 168,
		note: [
			"不需要很大，一本书和一个安静的角落就够了。",
			"It does not need to be big. A good book and a quiet corner are enough.",
		],
	},
	{
		id: 8,
		category: "travel",
		title: ["在森林里，重新充电", "Offline looks good from here"],
		author: "Theo Kim",
		photo: "photo-1441974231531-c6227db76b6e",
		ratio: "4 / 5",
		likes: 321,
		note: ["收起手机，沿着光的方向走一段。", "Put the phone away for a while. Walk toward the light."],
	},
] as const;
const photoUrl = (photo: string) => `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=900&q=80`;
export default function Feed({ locale }: SceneProps) {
	const t = translator(locale);
	const [category, setCategory] = useState("all");
	const [query, setQuery] = useState("");
	const [liked, setLiked] = useState<number[]>([]);
	const [saved, setSaved] = useState<number[]>([]);
	const [selected, setSelected] = useState<number | null>(null);
	const toggle = (id: number, values: number[], set: (values: number[]) => void) =>
		set(values.includes(id) ? values.filter((x) => x !== id) : [...values, id]);
	const visible = posts.filter(
		(p) =>
			(category === "all" || (category === "saved" ? saved.includes(p.id) : category === p.category)) &&
			`${translatePair(locale, p.title)} ${p.author}`.toLowerCase().includes(query.toLowerCase()),
	);
	const current = posts.find((p) => p.id === selected);
	const actions = (p: (typeof posts)[number]) => (
		<div className="sc-feed-actions">
			<IconButton
				variant="ghost"
				label={`${t("喜欢", "Like")} ${translatePair(locale, p.title)}`}
				aria-pressed={liked.includes(p.id)}
				icon={<Heart variant={liked.includes(p.id) ? "filled" : "outlined"} />}
				onClick={() => toggle(p.id, liked, setLiked)}
			/>
			<span>{p.likes + Number(liked.includes(p.id))}</span>
			<IconButton
				variant="ghost"
				label={`${t("收藏", "Save")} ${translatePair(locale, p.title)}`}
				aria-pressed={saved.includes(p.id)}
				icon={<Bookmark variant={saved.includes(p.id) ? "filled" : "outlined"} />}
				onClick={() => toggle(p.id, saved, setSaved)}
			/>
		</div>
	);
	return (
		<div className="sc-feed">
			<header className="sc-feed-header">
				<div>
					<span className="docs-eyebrow">{t("生活中的灵感", "THE EVERYDAY EDIT")}</span>
					<h2>{t("发现值得停留的日常。", "Good things, found here.")}</h2>
					<p>{t("小小的发现，让每一天多一点不同。", "Small discoveries. A fresh perspective on the everyday.")}</p>
				</div>
				<Input
					type="search"
					aria-label={t("搜索灵感", "Search inspiration")}
					placeholder={t("寻找你的下一份灵感…", "Find your next inspiration…")}
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
			</header>
			<ChipGroup className="sc-feed-filters" label={t("内容分类", "Feed categories")}>
				{[
					["all", t("发现", "Discover")],
					["spaces", t("空间", "Spaces")],
					["travel", t("旅行", "Outdoors")],
					["food", t("饮食", "Food & coffee")],
					["saved", t("我的收藏", "Saved")],
				].map(([value, label]) => (
					<Chip key={value} selected={category === value} onSelectedChange={() => setCategory(value)}>
						{label}
						{value === "saved" && saved.length > 0 ? ` · ${saved.length}` : ""}
					</Chip>
				))}
			</ChipGroup>
			<div className="sc-feed-grid">
				{visible.map((p) => (
					<Card
						variant="plain"
						key={p.id}
						role="article"
						aria-labelledby={`feed-title-${p.id}`}
						className="sc-feed-card"
					>
						<button
							className="sc-feed-cover"
							style={{ aspectRatio: p.ratio }}
							onClick={() => setSelected(p.id)}
							aria-label={translatePair(locale, p.title)}
						>
							<img
								src={photoUrl(p.photo)}
								alt={translatePair(locale, p.title)}
								loading="lazy"
								onError={(e) => {
									e.currentTarget.style.visibility = "hidden";
								}}
							/>
							<span>
								{t("查看故事", "View story")} <ArrowUpRight size={"1em"} className="docs-symbol" />
							</span>
						</button>
						<CardContent>
							<CardTitle id={`feed-title-${p.id}`}>
								<button onClick={() => setSelected(p.id)}>{translatePair(locale, p.title)}</button>
							</CardTitle>
							<div className="sc-feed-author">
								<Avatar
									size="sm"
									alt={p.author}
									fallback={p.author
										.split(" ")
										.map((x) => x[0])
										.join("")}
								/>
								<span>{p.author}</span>
							</div>
							{actions(p)}
						</CardContent>
					</Card>
				))}
			</div>
			{!visible.length && (
				<EmptyState
					title={
						category === "saved"
							? t("把喜欢的灵感收藏在这里", "Keep your favorite finds here")
							: t("没有找到相关内容", "No stories found")
					}
					action={
						<Button
							onClick={() => {
								setCategory("all");
								setQuery("");
							}}
						>
							{t("探索全部内容", "Explore all stories")}
						</Button>
					}
				/>
			)}
			<p className="sc-feed-end">
				{t("你已经看完了今天的灵感。明天再来看看。", "You’re all caught up. Make a little room for tomorrow.")}
			</p>
			<Dialog
				open={!!current}
				onOpenChange={(open) => {
					if (!open) setSelected(null);
				}}
			>
				<DialogContent title={current ? translatePair(locale, current.title) : ""} closeLabel={t("关闭", "Close")}>
					{current && (
						<div className="sc-stack">
							<img
								className="sc-feed-detail-image"
								src={photoUrl(current.photo)}
								alt={translatePair(locale, current.title)}
							/>
							<div className="sc-feed-author">
								<Avatar alt={current.author} fallback={current.author[0]} />
								<strong>{current.author}</strong>
							</div>
							<p>{translatePair(locale, current.note)}</p>
							{actions(current)}
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
