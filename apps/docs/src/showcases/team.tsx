import { useState } from "react";
import { Avatar, Button, Field, Input, Select, Table, Form, FormSubmit, Switch, useToast } from "@matrixzero/ui";
import { Panel, translator, type SceneProps } from "./shared";
export default function Team({ locale }: SceneProps) {
	const t = translator(locale);
	const { toast } = useToast();
	const [members, setMembers] = useState([
		{ email: "alex@example.com", role: "admin" },
		{ email: "sam@example.com", role: "member" },
	]);
	const [sso, setSso] = useState(true);
	const options = [
		{ value: "admin", label: t("管理员", "Admin") },
		{ value: "member", label: t("成员", "Member") },
		{ value: "viewer", label: t("只读成员", "Viewer") },
	];
	return (
		<div className="sc-stack">
			<Panel
				title={t("团队成员", "Your people")}
				description={t(
					"邀请协作者，并为每个人设置合适的权限。",
					"Invite collaborators and give everyone the right level of access.",
				)}
			>
				<Table>
					<thead>
						<tr>
							<th>{t("成员", "Member")}</th>
							<th>{t("角色", "Role")}</th>
						</tr>
					</thead>
					<tbody>
						{members.map((m, i) => (
							<tr key={m.email}>
								<th scope="row">
									<span className="sc-row">
										<Avatar alt={m.email} fallback={m.email.slice(0, 2).toUpperCase()} />
										{m.email}
									</span>
								</th>
								<td>
									<Select
										aria-label={`${t("角色", "Role")}: ${m.email}`}
										value={m.role}
										options={options}
										onValueChange={(role) => setMembers(members.map((x, j) => (j === i ? { ...x, role } : x)))}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
				<Form
					onSubmit={(e) => {
						e.preventDefault();
						const f = e.currentTarget;
						const email = String(new FormData(f).get("email")).trim().toLowerCase();
						if (members.some((m) => m.email === email)) {
							toast({ title: t("该成员已在团队中", "This member already belongs to the team"), tone: "warning" });
							return;
						}
						setMembers([...members, { email, role: "member" }]);
						f.reset();
						toast({ title: t("已添加演示成员", "Demo member added"), tone: "success" });
					}}
				>
					<div className="sc-inline-form">
						<Field label={t("邀请邮箱", "Invite email")} required>
							<Input name="email" type="email" required />
						</Field>
						<FormSubmit variant="primary">{t("添加成员", "Add member")}</FormSubmit>
					</div>
				</Form>
			</Panel>
			<Panel title={t("工作区安全", "Workspace security")}>
				<Field
					label={t("要求单点登录", "Require single sign-on")}
					description={t(
						"已启用时，成员需使用企业身份登录。",
						"When enabled, members sign in with their organization identity.",
					)}
				>
					<Switch checked={sso} onCheckedChange={setSso} />
				</Field>
				<Button
					onClick={() =>
						toast({ title: t("安全设置已保存在本次演示中", "Security settings saved for this demo"), tone: "success" })
					}
				>
					{t("保存设置", "Save settings")}
				</Button>
			</Panel>
		</div>
	);
}
