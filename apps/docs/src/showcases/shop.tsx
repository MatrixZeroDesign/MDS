import { useState } from "react";
import {
	Button,
	Field,
	Select,
	RadioCardGroup,
	RadioCard,
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
	useToast,
} from "@matrixzero/ui";
import { Panel, translator, type SceneProps } from "./shared";
export default function Shop({ locale }: SceneProps) {
	const t = translator(locale);
	const { toast } = useToast();
	const [color, setColor] = useState("sage");
	const [quantity, setQuantity] = useState("1");
	const [cart, setCart] = useState(0);
	return (
		<div className="sc-split">
			<div
				className="sc-product-art"
				data-color={color}
				role="img"
				aria-label={t("桌面台灯产品插画", "Illustration of a desk lamp")}
			>
				<svg viewBox="0 0 320 320" aria-hidden="true">
					<ellipse cx="160" cy="275" rx="84" ry="12" fill="currentColor" opacity=".12" />
					<path d="M160 125v140M115 267h90" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
					<path d="M90 135Q100 55 160 55Q220 55 230 135Z" fill="currentColor" />
					<ellipse cx="160" cy="137" rx="70" ry="10" fill="var(--mds-surface)" />
				</svg>
				<span>{t("为日常，留一盏灯。", "A little light for everyday life.")}</span>
			</div>
			<Panel
				title={t("微光桌面灯", "The Everyday Lamp")}
				description={t("柔和照明，可调灯罩，铝制灯身。", "Soft illumination. An adjustable shade. Made from aluminum.")}
			>
				<strong className="sc-price">$89</strong>
				<RadioCardGroup aria-label={t("灯具颜色", "Lamp color")} value={color} onValueChange={setColor}>
					<RadioCard value="sage" title={t("鼠尾草绿", "Sage")} />
					<RadioCard value="ink" title={t("墨黑", "Ink")} />
				</RadioCardGroup>
				<Field label={t("数量", "Quantity")}>
					<Select
						value={quantity}
						onValueChange={setQuantity}
						options={["1", "2", "3"].map((value) => ({ value, label: value }))}
					/>
				</Field>
				<Button
					onClick={() => {
						setCart(cart + Number(quantity));
						toast({ title: t("已加入演示购物袋", "Added to the demo bag"), tone: "success" });
					}}
				>
					{t("加入购物袋", "Add to bag")} · ${89 * Number(quantity)}
				</Button>
				<p role="status">
					{t(`购物袋内有 ${cart} 件商品`, `Your bag contains ${cart} ${cart === 1 ? "item" : "items"}`)}
				</p>
				<Accordion type="single" collapsible>
					<AccordionItem value="shipping">
						<AccordionTrigger>{t("配送与退货", "Shipping & returns")}</AccordionTrigger>
						<AccordionContent>
							{t(
								"示例配送：三至五个工作日送达，三十天内可退货。",
								"Sample delivery: three to five business days, with returns within thirty days.",
							)}
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</Panel>
		</div>
	);
}
