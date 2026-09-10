import { Select, Field, Button } from "@matrixzero/ui";
export default function Example() {
	return (
		<form>
			<Field label="地区 Region" required>
				<Select
					name="region"
					defaultValue="asia"
					options={[
						{ value: "asia", label: "亚洲 Asia" },
						{ value: "europe", label: "欧洲 Europe" },
					]}
				/>
			</Field>
			<Button type="reset">重置 Reset</Button>
		</form>
	);
}
