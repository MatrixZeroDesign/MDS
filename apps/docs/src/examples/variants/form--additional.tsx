import { type DocsLocale, translate } from "../../i18n";
import { useId, useState } from "react";
import { Form, FormSubmit, Field, Input, Button, type FormError } from "@matrixzero/ui";
export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const id = useId();
	const [errors, setErrors] = useState<FormError[]>([]);
	const [saved, setSaved] = useState(false);
	return (
		<Form
			errors={errors}
			errorTitle={t("请检查以下问题", "Please review the following")}
			submitErrorMessage={t("无法保存，请重试。", "Unable to save. Please try again.")}
			onReset={() => {
				setErrors([]);
				setSaved(false);
			}}
			onSubmitAsync={async (data) => {
				setSaved(false);
				// Simulated server latency; replace with your application's request.
				await new Promise((resolve) => setTimeout(resolve, 700));
				if (String(data.get("name")).trim().toLowerCase() === "offline") throw new Error("Simulated request failure");
				if (String(data.get("name")).trim().toLowerCase() === "admin") {
					setErrors([
						{ fieldId: id, message: t("此名称已被使用，请换一个。", "This name is already taken. Choose another.") },
					]);
					return;
				}
				setErrors([]);
				setSaved(true);
			}}
		>
			<Field
				id={id}
				label={t("工作区名称", "Workspace name")}
				required
				error={errors[0]?.message}
				description={t(
					"输入 admin 演示校验错误，offline 演示请求失败。",
					"Enter admin for a validation error, or offline for a request failure.",
				)}
			>
				<Input defaultValue="Matrix" name="name" autoComplete="organization" onChange={() => setErrors([])} />
			</Field>
			<Field label={t("邮箱", "Email")} required>
				<Input name="email" type="email" autoComplete="email" />
			</Field>
			<div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
				<FormSubmit variant="primary" name="intent" value="save">
					{t("保存", "Save")}
				</FormSubmit>
				<Button type="reset">{t("重置", "Reset")}</Button>
			</div>
			{saved && (
				<p role="status" style={{ margin: 0 }}>
					{t("已保存。", "Saved.")}
				</p>
			)}
		</Form>
	);
}
