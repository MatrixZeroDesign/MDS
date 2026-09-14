import { useState } from "react";
import { Chip, ChipGroup } from "@matrixzero/ui";
import { Flame } from "@matrixzero/icons";

export default function Example() {
	const [filters, setFilters] = useState(["Recent", "Popular"]);
	const [topics, setTopics] = useState(["Design systems", "Accessibility", "React"]);

	return (
		<div style={{ display: "grid", gap: 20 }}>
			<ChipGroup label="Feed filters">
				{["Recent", "Popular", "Following"].map((filter) => (
					<Chip
						key={filter}
						selected={filters.includes(filter)}
						onSelectedChange={(selected) =>
							setFilters((current) => (selected ? [...current, filter] : current.filter((item) => item !== filter)))
						}
						leading={filter === "Popular" ? <Flame size={13} /> : undefined}
					>
						{filter}
					</Chip>
				))}
			</ChipGroup>

			<ChipGroup label="Selected topics">
				{topics.map((topic) => (
					<Chip
						key={topic}
						removable
						removeLabel={`Remove ${topic}`}
						onRemove={() => setTopics((current) => current.filter((item) => item !== topic))}
					>
						{topic}
					</Chip>
				))}
			</ChipGroup>
		</div>
	);
}
