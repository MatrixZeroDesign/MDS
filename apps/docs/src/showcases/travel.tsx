import { languageTag, translate } from "../i18n";
import { useState } from "react";
import { Button, Field, DatePicker, TimePicker, Select, Form, FormSubmit, Steps, Callout } from "@matrixzero/ui";
import { Panel, translator, type SceneProps } from "./shared";
export default function Travel({ locale }: SceneProps) {
	const t = translator(locale);
	const [step, setStep] = useState(0);
	const [guests, setGuests] = useState("2");
	const [date, setDate] = useState("2026-10-16");
	const [arrival, setArrival] = useState("15:00");
	return (
		<div className="sc-stack">
			<div
				className="sc-landscape"
				role="img"
				aria-label={t("群山与日出的插画", "Illustration of mountains at sunrise")}
			>
				<svg viewBox="0 0 800 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
					<circle cx="600" cy="65" r="36" fill="currentColor" opacity=".35" />
					<path d="M0 220 220 30 400 220 600 70 800 220Z" fill="currentColor" opacity=".2" />
					<path d="M0 220 130 110 340 220 530 130 800 220Z" fill="currentColor" opacity=".4" />
				</svg>
			</div>
			<Steps
				label={t("预订步骤", "Booking steps")}
				current={step}
				steps={[
					{ id: "dates", label: t("日期", "Dates") },
					{ id: "review", label: t("确认", "Review") },
					{ id: "done", label: t("完成", "Done") },
				]}
			/>
			<Panel
				title={t("山间小屋 · 两晚慢生活", "A mountain cabin · two slow nights")}
				description={t("私人露台、森林步道和安静的清晨。", "A private terrace, forest trails and quiet mornings.")}
			>
				{step === 0 ? (
					<Form
						onSubmit={(e) => {
							e.preventDefault();
							setStep(1);
						}}
					>
						<div className="sc-two">
							<Field label={t("入住日期", "Check-in date")} required>
								<DatePicker value={date} onValueChange={setDate} locale={languageTag(locale)} required />
							</Field>
							<Field label={t("入住人数", "Guests")}>
								<Select
									value={guests}
									onValueChange={setGuests}
									options={["1", "2", "3", "4"].map((value) => ({ value, label: value }))}
								/>
							</Field>
						</div>
						<TimePicker
							label={t("预计到达时间", "Estimated arrival")}
							value={arrival}
							onValueChange={setArrival}
							locale={languageTag(locale)}
							hourCycle={24}
						/>
						<div className="sc-row">
							<FormSubmit variant="primary">{t("查看预订", "Review reservation")}</FormSubmit>
						</div>
					</Form>
				) : step === 1 ? (
					<>
						<p>
							{date} · {arrival} · {guests} {t("位客人 · 两晚", "guests · two nights")}
						</p>
						<strong className="sc-price">${240 + Number(guests) * 30}</strong>
						<p>
							{t(
								"此为演示预订，不会向住宿方发送请求。",
								"This is a demo reservation. No request is sent to a property.",
							)}
						</p>
						<div className="sc-row">
							<Button onClick={() => setStep(2)}>{t("确认演示预订", "Confirm demo reservation")}</Button>
							<Button variant="secondary" onClick={() => setStep(0)}>
								{t("修改日期", "Edit dates")}
							</Button>
						</div>
					</>
				) : (
					<>
						<Callout title={t("行程已准备好", "Your itinerary is ready")} tone="success">
							{t("预订已保存在当前演示中。", "Your reservation is saved in this demo.")}
						</Callout>
						<Button variant="secondary" onClick={() => setStep(0)}>
							{t("重新规划", "Plan another stay")}
						</Button>
					</>
				)}
			</Panel>
		</div>
	);
}
