import { NativeSelect, Field, Button } from "@matrixzero/ui";

export default function Example() {
	return (
		<form>
			<Field label="地区 Region">
				<NativeSelect name="region" defaultValue="asia">
					<option value="asia">亚洲 Asia</option>
					<option value="europe">欧洲 Europe</option>
				</NativeSelect>
			</Field>
			<Button type="reset">重置 Reset</Button>
		</form>
	);
}
