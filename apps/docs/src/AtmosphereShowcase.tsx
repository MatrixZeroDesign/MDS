import { useState } from "react";
import {
	Atmosphere,
	Button,
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogClose,
	Tabs,
	TabList,
	Tab,
	TabPanel,
	SegmentedControl,
} from "@matrixzero/ui";
import type { AtmosphereProps } from "@matrixzero/ui";
export function AtmosphereShowcase({ locale }: { locale: "zh" | "en" }) {
	const [tone, setTone] = useState<NonNullable<AtmosphereProps["tone"]>>("iris");
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	return (
		<section className="docs-atmosphere-section" aria-label={t("渐变展示风格", "Expressive surfaces")}>
			<div className="docs-row">
				<div>
					<p className="docs-eyebrow">ATMOSPHERE</p>
					<h2>{t("给重要时刻，一点色彩。", "A little color for the moments that matter.")}</h2>
				</div>
				<SegmentedControl
					label={t("渐变配色", "Gradient palette")}
					value={tone}
					onValueChange={(v) => setTone(v as typeof tone)}
					options={[
						{ value: "iris", label: t("鸢尾", "Iris") },
						{ value: "mint", label: t("薄荷", "Mint") },
						{ value: "peach", label: t("暖桃", "Peach") },
					]}
				/>
			</div>
			<Atmosphere tone={tone} className="docs-atmosphere-hero">
				<div className="docs-atmosphere-halo" aria-hidden="true">
					<span>m</span>
				</div>
				<p className="docs-eyebrow">MATRIX DESIGN SYSTEM</p>
				<h3>{t("让想法，自然发生。", "Make room for what’s next.")}</h3>
				<p className="docs-atmosphere-description">
					{t(
						"柔和的色彩，清晰的表达。为欢迎、新功能与值得停留的时刻，留一点空间。",
						"Soft color. Clear intentions. A little room for welcomes, new possibilities, and moments worth noticing.",
					)}
				</p>
				<Dialog>
					<DialogTrigger asChild>
						<Button variant="contrast" shape="pill" size="lg">
							{t("探索新体验", "Explore the experience")}
						</Button>
					</DialogTrigger>
					<DialogContent
						title={t("探索 Matrix", "Explore Matrix")}
						closeLabel={t("关闭介绍", "Close introduction")}
						className="docs-atmosphere-dialog"
					>
						<Atmosphere tone={tone} className="docs-atmosphere-dialog-surface">
							<Tabs defaultValue="create" variant="segmented" shape="pill" size="lg">
								<TabList aria-label={t("体验介绍", "Experience introduction")} className="docs-atmosphere-tabs">
									<Tab value="create">{t("创作", "Create")}</Tab>
									<Tab value="connect">{t("连接", "Connect")}</Tab>
								</TabList>
								<TabPanel value="create">
									<h2>{t("从一个好想法开始。", "Start with a good idea.")}</h2>
									<p>
										{t(
											"用清晰的组件搭建你的工作空间，让每一次创作，都拥有恰到好处的节奏。",
											"Build your workspace with thoughtful components, and give every new idea the space to grow.",
										)}
									</p>
								</TabPanel>
								<TabPanel value="connect">
									<h2>{t("把可能，连接起来。", "Bring possibilities together.")}</h2>
									<p>
										{t(
											"从应用到团队，让熟悉的体验保持一致，把注意力留给真正重要的事情。",
											"Connect applications and people through a familiar experience, keeping attention on what matters.",
										)}
									</p>
								</TabPanel>
							</Tabs>
							<DialogClose asChild>
								<Button variant="contrast" shape="pill" size="lg">
									{t("开始探索", "Let’s get started")}
								</Button>
							</DialogClose>
						</Atmosphere>
					</DialogContent>
				</Dialog>
				<p className="docs-atmosphere-caption">
					{t("渐变背景 · 胶囊按钮 · 主题自适应", "Gradient surfaces · Pill actions · Theme aware")}
				</p>
			</Atmosphere>
		</section>
	);
}
