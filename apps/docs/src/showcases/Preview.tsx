/** Small, theme-aware editorial previews; all text and controls live in the real scene. */
export function Preview({ id }: { id: string }) {
	const frame = (
		<rect
			x="26"
			y="12"
			width="268"
			height="128"
			rx="10"
			fill="var(--mds-surface)"
			stroke="currentColor"
			strokeOpacity=".2"
		/>
	);
	const lines = (
		<>
			{[50, 76, 102].map((y, i) => (
				<g key={y}>
					<circle cx="52" cy={y} r="7" fill="currentColor" opacity=".25" />
					<rect x="72" y={y - 3} width={100 - i * 15} height="6" rx="3" fill="currentColor" opacity=".15" />
				</g>
			))}
		</>
	);
	let art;
	switch (id) {
		case "overview":
		case "showcase-wellness":
			art = (
				<>
					{frame}
					{[44, 68, 92, 116, 140, 164, 188, 212, 236].map((x, i) => (
						<rect
							key={x}
							x={x}
							y={115 - [25, 44, 35, 58, 72, 62, 80, 56, 90][i]}
							width="14"
							height={[25, 44, 35, 58, 72, 62, 80, 56, 90][i]}
							rx="4"
							fill="currentColor"
							opacity={i === 8 ? ".8" : ".25"}
						/>
					))}
				</>
			);
			break;
		case "showcase-projects":
			art = (
				<>
					{[30, 122, 214].map((x, i) => (
						<g key={x}>
							<rect
								x={x}
								y="12"
								width="78"
								height="128"
								rx="10"
								fill="var(--mds-surface)"
								stroke="currentColor"
								strokeOpacity=".2"
							/>
							{Array.from({ length: 3 - i }, (_, j) => (
								<rect
									key={j}
									x={x + 10}
									y={26 + j * 33}
									width="58"
									height="24"
									rx="5"
									fill="currentColor"
									opacity=".16"
								/>
							))}
						</g>
					))}
				</>
			);
			break;
		case "policy":
		case "showcase-team":
			art = (
				<>
					{frame}
					{lines}
					{[50, 76, 102].map((y, i) => (
						<g key={y}>
							<rect
								x="236"
								y={y - 7}
								width="30"
								height="14"
								rx="7"
								fill="currentColor"
								opacity={i === 2 ? ".15" : ".5"}
							/>
							<circle cx={i === 2 ? 243 : 259} cy={y} r="5" fill="var(--mds-surface)" />
						</g>
					))}
				</>
			);
			break;
		case "showcase-crm":
			art = (
				<>
					{frame}
					{lines}
					<path d="m206 108 18-24 16 8 30-46" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
					<circle cx="270" cy="46" r="6" fill="currentColor" />
				</>
			);
			break;
		case "showcase-support":
			art = (
				<>
					{frame}
					<rect x="45" y="35" width="155" height="32" rx="12" fill="currentColor" opacity=".15" />
					<rect x="124" y="80" width="150" height="36" rx="12" fill="currentColor" opacity=".35" />
				</>
			);
			break;
		case "showcase-billing":
			art = (
				<>
					{[35, 122, 209].map((x, i) => (
						<g key={x}>
							<rect
								x={x}
								y={i === 1 ? 12 : 24}
								width="76"
								height="116"
								rx="10"
								fill={i === 1 ? "currentColor" : "var(--mds-surface)"}
								opacity={i === 1 ? ".3" : "1"}
								stroke="currentColor"
								strokeOpacity=".25"
							/>
							<rect x={x + 15} y="52" width="30" height="8" rx="3" fill="currentColor" opacity=".5" />
							<rect x={x + 15} y="98" width="46" height="16" rx="5" fill="currentColor" opacity=".2" />
						</g>
					))}
				</>
			);
			break;
		case "showcase-shop":
			art = (
				<>
					<path d="M160 50v80m-30 0h60" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
					<path d="M103 66Q112 8 160 8Q208 8 217 66Z" fill="currentColor" opacity=".65" />
					<ellipse cx="160" cy="68" rx="57" ry="7" fill="var(--mds-surface)" />
				</>
			);
			break;
		case "showcase-travel":
			art = (
				<>
					<circle cx="237" cy="34" r="21" fill="currentColor" opacity=".3" />
					<path d="M0 145 98 20 201 145 259 64 320 145Z" fill="currentColor" opacity=".2" />
					<path d="M0 145 55 85 156 145 219 96 320 145Z" fill="currentColor" opacity=".4" />
				</>
			);
			break;
		case "showcase-learning":
			art = (
				<>
					{frame}
					<text x="48" y="91" fontSize="66" fontFamily="serif" fill="currentColor" opacity=".7">
						Aa
					</text>
					{[51, 76, 101].map((y) => (
						<rect
							key={y}
							x="169"
							y={y}
							width={y === 101 ? 64 : 95}
							height="6"
							rx="3"
							fill="currentColor"
							opacity=".2"
						/>
					))}
				</>
			);
			break;
		default:
			art = (
				<>
					<rect x="38" y="10" width="125" height="125" rx="14" fill="var(--mds-surface)" />
					<circle cx="100" cy="72" r="49" fill="currentColor" opacity=".5" />
					<circle cx="100" cy="72" r="16" fill="var(--mds-surface)" />
					{[50, 75, 100].map((y, i) => (
						<rect key={y} x="190" y={y} width={85 - i * 12} height="7" rx="3" fill="currentColor" opacity=".25" />
					))}
				</>
			);
	}
	return (
		<svg viewBox="0 0 320 150" className="sc-preview-svg" aria-hidden="true">
			{art}
		</svg>
	);
}
