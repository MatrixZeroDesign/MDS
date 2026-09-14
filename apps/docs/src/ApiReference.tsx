import { translatePair, type DocsLocale, translate } from "./i18n";
import { Table } from "@matrixzero/ui";
type Row = { name: string; type: string; defaultValue?: string; description?: [string, string]; required?: boolean };
type Group = { name: string; rows: Row[]; notes?: string[] };
const toastGroups: Group[] = [
	{
		name: "ToastProvider",
		rows: [
			{
				name: "children",
				type: "ReactNode",
				required: true,
				description: ["需要发送通知的界面。", "Content that can send notifications."],
			},
			{
				name: "duration",
				type: "number",
				defaultValue: "5000",
				description: [
					"默认停留时间（毫秒）；Infinity 表示持续显示。",
					"Default lifetime in milliseconds; Infinity keeps notifications open.",
				],
			},
			{
				name: "label",
				type: "string",
				defaultValue: '"Notification"',
				description: ["读屏通知前缀，需要本地化。", "Localized screen-reader announcement prefix."],
			},
		],
	},
	{
		name: "Toaster",
		rows: [
			{
				name: "label",
				type: "string",
				defaultValue: '"Notifications ({hotkey})"',
				description: [
					"通知区域名称，{hotkey} 会替换为快捷键。",
					"Region name; {hotkey} is replaced with the keyboard shortcut.",
				],
			},
			{
				name: "closeLabel",
				type: "string",
				defaultValue: '"Dismiss notification"',
				description: ["关闭按钮的可访问名称。", "Accessible name of each close button."],
			},
		],
	},
	{
		name: "useToast",
		rows: [
			{
				name: "toast(options)",
				type: "(options: ToastOptions) => number",
				description: ["发送通知，返回通知 ID。", "Create a notification and return its ID."],
			},
			{
				name: "dismiss(id)",
				type: "(id: number) => void",
				description: ["关闭指定通知。", "Dismiss one notification."],
			},
			{ name: "clear()", type: "() => void", description: ["关闭所有通知。", "Dismiss all notifications."] },
		],
	},
	{
		name: "ToastOptions",
		rows: [
			{ name: "title", type: "string", required: true, description: ["简短的反馈标题。", "Concise feedback title."] },
			{ name: "description", type: "ReactNode", description: ["补充说明。", "Supporting detail."] },
			{
				name: "tone",
				type: '"neutral" | "info" | "success" | "warning" | "danger"',
				defaultValue: '"neutral"',
				description: ["通知的语义颜色。", "Semantic notification color."],
			},
			{
				name: "duration",
				type: "number",
				defaultValue: "ToastProvider.duration",
				description: [
					"覆盖单条通知的停留时间；Infinity 表示持续显示。",
					"Override this notification’s lifetime; Infinity keeps it open.",
				],
			},
			{
				name: "action",
				type: "{ label: string; altText: string; onClick: () => void }",
				description: ["可选操作，altText 解释操作用途。", "Optional action; altText describes its purpose."],
			},
		],
	},
];
const formGroups: Group[] = [
	{
		name: "Form",
		rows: [
			{
				name: "onSubmitAsync",
				type: "(data: FormData, form: HTMLFormElement) => Promise<void>",
				description: [
					"原生校验通过后调用，自动管理提交状态。",
					"Runs after native validation and manages pending state.",
				],
			},
			{
				name: "onSubmit",
				type: "FormEventHandler<HTMLFormElement>",
				description: [
					"原生提交事件；preventDefault 会跳过 onSubmitAsync。",
					"Native submit handler; preventDefault skips onSubmitAsync.",
				],
			},
			{
				name: "submitting",
				type: "boolean",
				defaultValue: "false",
				description: ["由外部表单库控制的提交状态。", "Pending state controlled by an external form library."],
			},
			{
				name: "errors",
				type: "readonly FormError[]",
				defaultValue: "[]",
				description: [
					"摘要内容；提交后聚焦首个错误控件。",
					"Summary entries; focus the first invalid control after submission.",
				],
			},
			{
				name: "errorTitle",
				type: "string",
				defaultValue: '"Please review the following"',
				description: ["错误摘要标题，需要本地化。", "Localized error summary title."],
			},
			{
				name: "submitErrorMessage",
				type: "string",
				defaultValue: '"Unable to submit. Please try again."',
				description: ["异步提交失败时显示的消息。", "Message displayed when async submission rejects."],
			},
			{
				name: "onSubmitError",
				type: "(error: unknown) => void",
				description: ["接收异步提交异常。", "Receive a rejected submission error."],
			},
		],
	},
	{
		name: "FormSubmit",
		rows: [
			{
				name: "loading",
				type: "boolean",
				description: [
					"与 Form 的提交状态合并；其他属性沿用 Button，type 固定为 submit。",
					"Combined with Form pending state; other Button props are supported, with type fixed to submit.",
				],
			},
		],
	},
	{
		name: "FormErrorSummary",
		rows: [
			{
				name: "errors",
				type: "readonly FormError[]",
				required: true,
				description: ["可单独渲染的错误摘要。", "Error entries for an independently rendered summary."],
			},
			{
				name: "title",
				type: "string",
				required: true,
				description: ["摘要的可访问标题。", "Accessible summary title."],
			},
		],
	},
	{
		name: "FormError",
		rows: [
			{
				name: "fieldId",
				type: "string",
				description: ["关联 Field 的 id；省略表示表单级错误。", "Associated Field ID; omit for a form-level error."],
			},
			{
				name: "message",
				type: "ReactNode",
				required: true,
				description: ["本地化的错误消息。", "Localized error message."],
			},
		],
	},
	{
		name: "useFormStatus",
		rows: [
			{
				name: "submitting",
				type: "boolean",
				description: ["读取最近一层 MDS Form 的提交状态。", "Read the nearest MDS Form pending state."],
			},
		],
	},
];
const inputGroups: Group[] = [
	{
		name: "Input",
		rows: [
			{
				name: "value / defaultValue",
				type: "string | number | readonly string[]",
				description: ["受控值或初始值。", "Controlled value or initial value."],
			},
			{
				name: "onChange",
				type: "ChangeEventHandler<HTMLInputElement>",
				description: ["处理输入变更。", "Handle input changes."],
			},
			{
				name: "type",
				type: "HTMLInputTypeAttribute",
				defaultValue: '"text"',
				description: ["原生输入类型，如 email、password。", "Native input type, such as email or password."],
			},
			{ name: "name", type: "string", description: ["表单提交时的字段名称。", "Field name in submitted form data."] },
			{
				name: "placeholder",
				type: "string",
				description: ["输入提示，不替代 Field 标签。", "Input hint; does not replace a Field label."],
			},
			{
				name: "required / disabled",
				type: "boolean",
				description: ["显式设置或从 Field 继承。", "Set explicitly or inherit from Field."],
			},
			{ name: "autoComplete", type: "string", description: ["浏览器自动填充用途。", "Browser autofill purpose."] },
		],
	},
];

// Split contract summaries only at top level, preserving object and callback types.
function statements(source: string) {
	const parts: string[] = [];
	let depth = 0,
		quote = "",
		start = 0;
	for (let i = 0; i < source.length; i++) {
		const c = source[i];
		if (quote) {
			if (c === quote && source[i - 1] !== "\\") quote = "";
			continue;
		}
		if (c === '"' || c === "'") {
			quote = c;
			continue;
		}
		if ("([{".includes(c)) depth++;
		if (")]}".includes(c)) depth--;
		if (c === ";" && depth === 0) {
			parts.push(source.slice(start, i).trim());
			start = i + 1;
		}
	}
	parts.push(source.slice(start).trim());
	return parts.filter(Boolean);
}
function summarize(api: string, name: string): Group[] {
	const groups: Group[] = [{ name, rows: [], notes: [] }];
	let current = groups[0];
	for (let part of statements(api)) {
		const group = part.match(/^([A-Z][\w]*(?:\s*\/\s*[A-Z][\w]*)*):\s*(.*)$/);
		if (group) {
			current = { name: group[1], rows: [], notes: [] };
			groups.push(current);
			part = group[2];
		}
		const property = part.match(/^([\w/.[\]-]+)(\?)?:\s*(.+)$/);
		if (!property) {
			current.notes!.push(part);
			continue;
		}
		const [, key, optional, contract] = property;
		const equal = contract.indexOf(" = ");
		current.rows.push({
			name: key,
			type: equal < 0 ? contract : contract.slice(0, equal),
			defaultValue: equal < 0 ? undefined : contract.slice(equal + 3),
			required: !optional,
		});
	}
	return groups.filter((g) => g.rows.length || g.notes?.length);
}
export function ApiReference({
	api,
	name,
	slug,
	locale,
}: {
	api: string;
	name: string;
	slug: string;
	locale: DocsLocale;
}) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const groups =
		slug === "toast"
			? toastGroups
			: slug === "form"
				? formGroups
				: slug === "input"
					? inputGroups
					: summarize(api, name);
	return (
		<div className="docs-api-groups">
			{groups.map((group, index) => (
				<section className="docs-api-group" key={`${group.name}-${index}`} aria-label={`${group.name} API`}>
					<h3>{group.name} API</h3>
					{group.rows.length > 0 && (
						<div
							className="docs-api-scroll"
							role="region"
							aria-label={`${group.name} ${t("属性表", "properties")}`}
							tabIndex={0}
						>
							<Table className="docs-api-table">
								<thead>
									<tr>
										<th scope="col">{t("属性 / 方法", "Property / method")}</th>
										<th scope="col">{t("类型", "Type")}</th>
										<th scope="col">{t("默认值", "Default")}</th>
										{group.rows.some((r) => r.description) && <th scope="col">{t("说明", "Description")}</th>}
									</tr>
								</thead>
								<tbody>
									{group.rows.map((row) => (
										<tr key={row.name}>
											<th scope="row">
												<code>{row.name}</code>
												{row.required && <span className="docs-api-required">{t("必填", "Required")}</span>}
											</th>
											<td>
												<code>{row.type}</code>
											</td>
											<td>
												<code>{row.defaultValue ?? "—"}</code>
											</td>
											{group.rows.some((r) => r.description) && (
												<td>{row.description ? translatePair(locale, row.description) : "—"}</td>
											)}
										</tr>
									))}
								</tbody>
							</Table>
						</div>
					)}
					{!!group.notes?.length && (
						<ul className="docs-api-notes">
							{group.notes.map((note) => (
								<li key={note}>
									<code>{note}</code>
								</li>
							))}
						</ul>
					)}
				</section>
			))}
		</div>
	);
}
