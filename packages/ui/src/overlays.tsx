import { useDirection } from "@radix-ui/react-direction";
import { useId } from "react";
import type { ComponentProps, ReactNode } from "react";
import * as Menu from "@radix-ui/react-dropdown-menu";
import * as D from "@radix-ui/react-dialog";
import * as T from "@radix-ui/react-tooltip";
import { Check, ChevronDown, X } from "@matrixzero/icons";
import { cx, Button } from "./controls.js";
import { usePortalContainer } from "./theme.js";
export interface ChoiceOption {
	value: string;
	label: string;
	description?: string;
	disabled?: boolean;
}
export interface ChoiceMenuProps {
	label: string;
	value: string;
	onValueChange: (value: string) => void;
	options: readonly ChoiceOption[];
	disabled?: boolean;
	id?: string;
	placeholder?: string;
	className?: string;
}
/** Non-modal selection menu. Uses menuitemradio semantics, not a form select/combobox. */
export function ChoiceMenu({
	label,
	value,
	onValueChange,
	options,
	disabled,
	id,
	placeholder = "—",
	className,
}: ChoiceMenuProps) {
	const container = usePortalContainer();
	return (
		<Menu.Root modal={false}>
			<Menu.Trigger disabled={disabled} id={id} aria-label={label} className={cx("mds-choice-trigger", className)}>
				<span>{options.find((o) => o.value === value)?.label ?? placeholder}</span>
				<ChevronDown size={14} aria-hidden="true" />
			</Menu.Trigger>
			{container && (
				<Menu.Portal container={container}>
					<Menu.Content sideOffset={6} collisionPadding={12} loop className="mds-menu">
						<Menu.Label className="mds-menu-label">{label}</Menu.Label>
						<Menu.RadioGroup value={value} onValueChange={onValueChange}>
							{options.map((o) => (
								<Menu.RadioItem
									textValue={o.label}
									key={o.value}
									value={o.value}
									disabled={o.disabled}
									className="mds-menu-item"
								>
									<span>
										{o.label}
										{o.description && <span className="mds-description">{o.description}</span>}
									</span>
									<span className="mds-menu-check">
										<Menu.ItemIndicator>
											<Check size={14} />
										</Menu.ItemIndicator>
									</span>
								</Menu.RadioItem>
							))}
						</Menu.RadioGroup>
					</Menu.Content>
				</Menu.Portal>
			)}
		</Menu.Root>
	);
}
export const DropdownMenu = Menu.Root;
export const DropdownTrigger = Menu.Trigger;
export const DropdownSeparator = () => <Menu.Separator className="mds-menu-separator" />;
export const DropdownItem = ({ className, ...props }: ComponentProps<typeof Menu.Item>) => (
	<Menu.Item {...props} className={cx("mds-menu-item", className)} />
);
export function DropdownContent({ className, ...props }: ComponentProps<typeof Menu.Content>) {
	const container = usePortalContainer();
	return container ? (
		<Menu.Portal container={container}>
			<Menu.Content sideOffset={6} collisionPadding={12} {...props} className={cx("mds-menu", className)} />
		</Menu.Portal>
	) : null;
}
export const Dialog = D.Root;
export const DialogTrigger = D.Trigger;
export const DialogClose = D.Close;
export interface DialogContentProps extends Omit<ComponentProps<typeof D.Content>, "title"> {
	title: ReactNode;
	description?: ReactNode;
	closeLabel: string;
}
export function DialogContent({ title, description, closeLabel, children, className, ...props }: DialogContentProps) {
	const container = usePortalContainer(),
		descriptionId = useId();
	return container ? (
		<D.Portal container={container}>
			<D.Overlay className="mds-overlay" />
			<D.Content
				aria-describedby={description ? descriptionId : undefined}
				{...props}
				className={cx("mds-dialog", className)}
			>
				<div className="mds-dialog-header">
					<D.Title className="mds-dialog-title">{title}</D.Title>
					<D.Close asChild>
						<Button variant="ghost" aria-label={closeLabel}>
							<X size={18} />
						</Button>
					</D.Close>
				</div>
				{description && (
					<D.Description id={descriptionId} className="mds-description">
						{description}
					</D.Description>
				)}
				{children}
			</D.Content>
		</D.Portal>
	) : null;
}
export const TooltipProvider = T.Provider;
export function Tooltip({ content, children }: { content: ReactNode; children: ReactNode }) {
	const container = usePortalContainer();
	return (
		<T.Root>
			<T.Trigger asChild>{children}</T.Trigger>
			{container && (
				<T.Portal container={container}>
					<T.Content sideOffset={6} collisionPadding={10} className="mds-tooltip">
						{content}
						<T.Arrow className="mds-tooltip-arrow" />
					</T.Content>
				</T.Portal>
			)}
		</T.Root>
	);
}

export const SideSheet = D.Root;
export const SideSheetTrigger = D.Trigger;
export const SideSheetClose = D.Close;
export interface SideSheetContentProps extends DialogContentProps {
	side?: "left" | "right" | "start" | "end";
}
export function SideSheetContent({
	title,
	description,
	closeLabel,
	side = "end",
	children,
	className,
	...props
}: SideSheetContentProps) {
	const direction = useDirection();
	const physicalSide =
		side === "start"
			? direction === "rtl"
				? "right"
				: "left"
			: side === "end"
				? direction === "rtl"
					? "left"
					: "right"
				: side;
	const container = usePortalContainer(),
		descriptionId = useId();
	return container ? (
		<D.Portal container={container}>
			<D.Overlay className="mds-overlay" />
			<D.Content
				{...props}
				aria-describedby={description ? descriptionId : undefined}
				data-side={physicalSide}
				className={cx("mds-sheet", className)}
			>
				<div className="mds-dialog-header">
					<D.Title className="mds-dialog-title">{title}</D.Title>
					<D.Close asChild>
						<Button variant="ghost" aria-label={closeLabel}>
							<X size={18} />
						</Button>
					</D.Close>
				</div>
				{description && (
					<D.Description id={descriptionId} className="mds-description">
						{description}
					</D.Description>
				)}
				<div className="mds-sheet-body">{children}</div>
			</D.Content>
		</D.Portal>
	) : null;
}
