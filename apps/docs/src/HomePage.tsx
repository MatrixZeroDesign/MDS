import { Asterisk } from "@matrixzero/icons";
import { type DocsLocale, translate } from "./i18n";
import { useState } from "react";
import { Card, Avatar, IconButton, Switch, Progress, Badge } from "@matrixzero/ui";
import { Heart, ArrowUpRight } from "@matrixzero/icons";
import { appPath } from "./router";
import "./home.css";
export function HomePage({ locale }: { locale: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const [liked, setLiked] = useState(false);
	const [quiet, setQuiet] = useState(true);
	return (
		<div className="home-editorial">
			<header className="home-intro">
				<p className="docs-eyebrow">MATRIX DESIGN SYSTEM</p>
				<h1>{t("让好设计，融入日常。", "Make room for good design.")}</h1>
				<div className="home-intro-bottom">
					<p>
						{t(
							"清晰的组件，细腻的交互。让每一个想法，都成为值得停留的体验。",
							"Thoughtful components. Considered details. Everything you need to make an everyday experience feel extraordinary.",
						)}
					</p>
					<a className="home-start" href={appPath("/docs/start")}>
						{t("开始构建", "Start building")} <ArrowUpRight size={18} />
					</a>
				</div>
			</header>
			<div className="home-mosaic">
				<Card variant="plain" className="home-photo-card">
					<a href={appPath("/showcase-feed")} className="home-photo-link">
						<img
							src="https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&w=1000&q=85"
							alt={t("阳光下的安静工作空间", "A quiet workspace in natural light")}
						/>
						<span className="home-photo-caption">
							<small>{t("留白，也是一种设计", "A LITTLE SPACE TO THINK")}</small>
							<strong>{t("让界面，自然呼吸。", "Less noise. More room.")}</strong>
							<span>
								{t("探索灵感社区", "Explore the inspiration feed")}{" "}
								<ArrowUpRight size={"1em"} className="docs-symbol" />
							</span>
						</span>
					</a>
					<div className="home-photo-credit">
						<div>
							<Avatar size="sm" alt="Matrix" fallback="M" />
							<span>{t("日常灵感", "The everyday edit")}</span>
						</div>
						<IconButton
							variant="ghost"
							label={t("喜欢这份灵感", "Like this inspiration")}
							aria-pressed={liked}
							icon={<Heart variant={liked ? "filled" : "outlined"} />}
							onClick={() => setLiked(!liked)}
						/>
					</div>
				</Card>
				<div className="home-middle">
					<Card variant="plain" className="home-type-card">
						<span className="docs-eyebrow">{t("从细节开始", "BUILT FROM THE DETAILS")}</span>
						<div className="home-type-art" aria-hidden="true">
							Aa<span>字</span>
						</div>
						<h2>{t("一种语言，无限表达。", "One language. Your expression.")}</h2>
						<p>
							{t(
								"字体、色彩、间距与动效，为每个产品留出自己的个性。",
								"Type, color, space, and motion. A foundation that leaves room for your own character.",
							)}
						</p>
						<a href={appPath("/design")}>
							{t("我们的设计原则", "Meet the design principles")} <ArrowUpRight size={"1em"} className="docs-symbol" />
						</a>
					</Card>
					<Card className="home-live-card">
						<div className="home-live-heading">
							<Badge>{t("试着交互", "TRY IT LIVE")}</Badge>
							<span aria-hidden="true">
								<Asterisk size={28} className="docs-symbol" />
							</span>
						</div>
						<h2>{t("专注此刻。", "A moment of focus.")}</h2>
						<p>{t("小小的交互，也值得认真对待。", "Even the smallest interaction deserves care.")}</p>
						<div className="home-switch-row">
							<span>{t("静音通知", "Quiet notifications")}</span>
							<Switch checked={quiet} onCheckedChange={setQuiet} aria-label={t("静音通知", "Quiet notifications")} />
						</div>
						<Progress value={quiet ? 72 : 36} aria-label={t("专注节奏", "Focus rhythm")} />
						<small role="status">
							{quiet
								? t("给好想法，留一点安静。", "A little quiet for your next good idea.")
								: t("通知已开启，随时保持联系。", "Notifications on. Stay in the loop.")}
						</small>
					</Card>
				</div>
				<Card variant="plain" className="home-travel-card">
					<a href={appPath("/showcase-travel")}>
						<img
							src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=900&q=85"
							alt={t("山间湖泊与安静的小镇", "A lakeside town surrounded by mountains")}
						/>
						<div>
							<small className="docs-eyebrow">{t("从组件到体验", "FROM COMPONENTS TO EXPERIENCES")}</small>
							<h2>{t("下一站，更多可能。", "A change of scenery.")}</h2>
							<p>
								{t(
									"预订一场旅行，规划一个项目，发现新的灵感。看看组件如何一起工作。",
									"Book a getaway. Plan a project. Find a new favorite. See what happens when the pieces come together.",
								)}
							</p>
							<span>
								{t("走进真实场景", "Step inside a real experience")}{" "}
								<ArrowUpRight size={"1em"} className="docs-symbol" />
							</span>
						</div>
					</a>
				</Card>
			</div>
			<section className="home-explore">
				<div className="home-section-title">
					<h2>{t("从这里，开始你的创作。", "Find your starting point.")}</h2>
					<p>{t("从第一块组件，到完整的产品体验。", "From the first component to the whole experience.")}</p>
				</div>
				<div className="home-resource-grid">
					{[
						[
							"/docs/start",
							t("组件", "Components"),
							t("可以直接使用的构建模块，配有交互示例与 API。", "Building blocks with live examples and clear APIs."),
						],
						[
							"/icons",
							t("图标", "Icons"),
							t(
								"精心绘制，支持描边与填充，让表达更准确。",
								"Considered outlines and filled forms for a clearer expression.",
							),
						],
						[
							"/charts",
							t("图表", "Charts"),
							t("让数据有条理，让趋势一目了然。", "Give your data a shape and your story a little clarity."),
						],
						[
							"/showcase",
							t("应用场景", "Showcase"),
							t("看看同一套组件如何塑造不同的产品。", "See one system take on many different personalities."),
						],
					].map(([href, title, description], i) => (
						<Card variant="plain" key={href}>
							<a href={href}>
								<span className="home-resource-number">
									0{i + 1}
									<ArrowUpRight size={19} />
								</span>
								<h3>{title}</h3>
								<p>{description}</p>
							</a>
						</Card>
					))}
				</div>
			</section>
		</div>
	);
}
