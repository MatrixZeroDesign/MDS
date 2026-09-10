import { Table } from "@matrixzero/ui";

export default function Example() {
	return (
		<Table>
			<caption>最近请求 Recent requests</caption>
			<thead>
				<tr>
					<th scope="col">模型 Model</th>
					<th scope="col">请求 Requests</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<th scope="row">Chat</th>
					<td>128</td>
				</tr>
			</tbody>
		</Table>
	);
}
