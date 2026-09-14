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
		case "showcase-chatbot":
			art = (
				<>
					<rect
						x="20"
						y="10"
						width="280"
						height="132"
						rx="12"
						fill="var(--mds-surface)"
						stroke="currentColor"
						strokeOpacity=".2"
					/>
					<rect x="20" y="10" width="70" height="132" rx="12" fill="currentColor" opacity=".08" />
					{[35, 55, 75].map((y, index) => (
						<rect
							key={y}
							x="32"
							y={y}
							width={index === 0 ? 44 : 34}
							height="5"
							rx="2.5"
							fill="currentColor"
							opacity={index === 0 ? ".42" : ".18"}
						/>
					))}
					<rect x="190" y="37" width="82" height="22" rx="10" fill="currentColor" opacity=".14" />
					<circle cx="112" cy="82" r="9" fill="currentColor" opacity=".7" />
					<rect x="128" y="75" width="118" height="6" rx="3" fill="currentColor" opacity=".26" />
					<rect x="128" y="88" width="94" height="6" rx="3" fill="currentColor" opacity=".16" />
					<rect x="112" y="113" width="160" height="18" rx="9" fill="currentColor" opacity=".1" />
				</>
			);
			break;
		case "showcase-feed":
			art = (
				<>
					{[32, 122, 212].map((x, i) => (
						<g key={x}>
							{[0, 1].map((j) => (
								<g key={j}>
									<rect
										x={x}
										y={12 + j * 70}
										width="76"
										height={48 - i * 5}
										rx="8"
										fill="currentColor"
										opacity={0.12 + i * 0.07}
									/>
									<circle cx={x + 6} cy={67 + j * 70 - i * 5} r="4" fill="currentColor" opacity=".3" />
									<rect
										x={x + 16}
										y={64 + j * 70 - i * 5}
										width="44"
										height="5"
										rx="2"
										fill="currentColor"
										opacity=".2"
									/>
								</g>
							))}
						</g>
					))}
				</>
			);
			break;
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
		case "showcase-robotics":
			art = (
				<>
					<path
						d="M42 106C88 106 90 45 145 45s68 65 123 65"
						fill="none"
						stroke="currentColor"
						strokeWidth="3"
						strokeDasharray="2 7"
						opacity=".35"
					/>
					{[
						[42, 106],
						[145, 45],
						[268, 110],
					].map(([x, y], index) => (
						<g key={x}>
							<rect
								x={x - 17}
								y={y - 17}
								width="34"
								height="34"
								rx="9"
								fill="currentColor"
								opacity={index === 1 ? ".72" : ".18"}
							/>
							<circle cx={x} cy={y} r="5" fill="var(--mds-surface)" />
						</g>
					))}
					<rect x="34" y="16" width="72" height="7" rx="3" fill="currentColor" opacity=".18" />
				</>
			);
			break;
		case "showcase-finance":
			art = (
				<>
					{frame}
					<path
						d="M45 112 78 98 104 103 137 75 170 82 202 54 236 60 274 29"
						fill="none"
						stroke="currentColor"
						strokeWidth="5"
						strokeLinecap="round"
						strokeLinejoin="round"
						opacity=".65"
					/>
					<path
						d="M45 112 78 98 104 103 137 75 170 82 202 54 236 60 274 29V123H45Z"
						fill="currentColor"
						opacity=".09"
					/>
					<circle cx="274" cy="29" r="6" fill="currentColor" />
				</>
			);
			break;
		case "showcase-vehicle":
			art = (
				<>
					<ellipse cx="160" cy="117" rx="118" ry="12" fill="currentColor" opacity=".1" />
					<path
						d="M45 99c5-22 22-34 47-37l40-5 34-29c11-9 24-13 38-13h30c18 0 34 7 46 20l20 23 28 8c18 5 27 16 28 33H45Z"
						fill="currentColor"
						opacity=".55"
					/>
					<circle cx="98" cy="99" r="21" fill="var(--mds-surface)" stroke="currentColor" strokeWidth="6" />
					<circle cx="267" cy="99" r="21" fill="var(--mds-surface)" stroke="currentColor" strokeWidth="6" />
				</>
			);
			break;
		case "showcase-smart-home":
			art = (
				<>
					<path
						d="M61 73 160 10l99 63v68H61Z"
						fill="var(--mds-surface)"
						stroke="currentColor"
						strokeWidth="3"
						opacity=".9"
					/>
					{[
						[102, 78],
						[160, 55],
						[215, 90],
						[134, 119],
					].map(([x, y], index) => (
						<g key={x + y}>
							<circle
								cx={x}
								cy={y}
								r={index === 1 ? 13 : 9}
								fill="currentColor"
								opacity={index === 1 ? ".72" : ".22"}
							/>
							<circle cx={x} cy={y} r="3" fill="var(--mds-surface)" />
						</g>
					))}
				</>
			);
			break;
		case "showcase-creator":
			art = (
				<>
					<rect x="25" y="14" width="185" height="126" rx="12" fill="currentColor" opacity=".18" />
					<circle cx="116" cy="77" r="24" fill="currentColor" opacity=".65" />
					<path d="m109 64 20 13-20 13Z" fill="var(--mds-surface)" />
					{[34, 58, 82, 106].map((y, index) => (
						<rect
							key={y}
							x="232"
							y={y}
							width={18 + index * 10}
							height="8"
							rx="4"
							fill="currentColor"
							opacity={0.18 + index * 0.12}
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
