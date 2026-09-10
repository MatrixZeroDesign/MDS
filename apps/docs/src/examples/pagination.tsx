import { useState } from "react";
import { Pagination } from "@matrixzero/ui";

export default function Example() {
	const [page, setPage] = useState(1);
	return (
		<Pagination
			page={page}
			pages={5}
			onPageChange={setPage}
			label="分页 Pages"
			previousLabel="上一页 Previous"
			nextLabel="下一页 Next"
		/>
	);
}
