import { type DocsLocale, translate } from "../i18n";
import type { ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@matrixzero/ui";
export type SceneProps = { locale: DocsLocale };
export const translator = (locale: SceneProps["locale"]) => (zh: string, en: string) => translate(locale, zh, en);
export function Panel({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle as="h2">{title}</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			<CardContent className="sc-stack">{children}</CardContent>
		</Card>
	);
}
export function Stat({ label, value }: { label: string; value: ReactNode }) {
	return (
		<div className="sc-stat">
			<span>{label}</span>
			<strong>{value}</strong>
		</div>
	);
}
