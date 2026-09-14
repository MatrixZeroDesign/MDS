import { createContext, useContext, useId, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import type { ComponentProps, FormEvent, ReactNode } from "react";
import { Button, cx } from "./controls.js";
export interface FormError {
	fieldId?: string;
	message: ReactNode;
}
export interface FormProps extends ComponentProps<"form"> {
	/** Managed client submission. Native validation runs before this callback. */
	onSubmitAsync?: (data: FormData, form: HTMLFormElement) => Promise<void>;
	onSubmitError?: (error: unknown) => void;
	submitting?: boolean;
	errors?: readonly FormError[];
	errorTitle?: string;
	submitErrorMessage?: string;
}
const FormContext = createContext({ submitting: false });
export function useFormStatus() {
	return useContext(FormContext);
}
function focusField(form: HTMLFormElement, id?: string) {
	if (!id) return false;
	const target = Array.from(form.querySelectorAll<HTMLElement>("[id]")).find((el) => el.id === id);
	if (!target || !target.getClientRects().length || target.matches(":disabled")) return false;
	target.focus();
	return document.activeElement === target;
}
export function Form({
	children,
	className,
	ref,
	onSubmit,
	onReset,
	onSubmitAsync,
	onSubmitError,
	submitting = false,
	errors = [],
	errorTitle = "Please review the following",
	submitErrorMessage = "Unable to submit. Please try again.",
	...props
}: FormProps) {
	const form = useRef<HTMLFormElement>(null);
	const lock = useRef(false);
	const attempted = useRef(false);
	const [pending, setPending] = useState(false);
	const [failed, setFailed] = useState(false);
	const busy = submitting || pending;
	useImperativeHandle(ref, () => form.current!, []);
	useLayoutEffect(() => {
		if (attempted.current && errors.length && form.current) {
			let focused = false;
			for (const error of errors) {
				if (focusField(form.current, error.fieldId)) {
					focused = true;
					break;
				}
			}
			if (!focused) form.current.querySelector<HTMLElement>(".mds-form-errors")?.focus();
		}
	}, [errors]);
	const submit = (event: FormEvent<HTMLFormElement>) => {
		if (busy || lock.current) {
			event.preventDefault();
			return;
		}
		attempted.current = true;
		setFailed(false);
		onSubmit?.(event);
		if (!onSubmitAsync || event.defaultPrevented) return;
		event.preventDefault();
		const element = event.currentTarget;
		const submitter = (event.nativeEvent as SubmitEvent).submitter;
		const data = new FormData(element, submitter);
		lock.current = true;
		setPending(true);
		void (async () => {
			try {
				await onSubmitAsync(data, element);
			} catch (error) {
				setFailed(true);
				onSubmitError?.(error);
			} finally {
				lock.current = false;
				setPending(false);
			}
		})();
	};
	return (
		<FormContext.Provider value={{ submitting: busy }}>
			<form
				{...props}
				ref={form}
				className={cx("mds-form", className)}
				aria-busy={busy || undefined}
				onSubmit={submit}
				onReset={(event) => {
					onReset?.(event);
					if (!event.defaultPrevented) {
						setFailed(false);
						attempted.current = false;
					}
				}}
			>
				{errors.length > 0 && <FormErrorSummary errors={errors} title={errorTitle} />}
				{failed && (
					<div className="mds-form-submit-error" role="alert">
						{submitErrorMessage}
					</div>
				)}
				{children}
			</form>
		</FormContext.Provider>
	);
}
export function FormSubmit({ loading, ...props }: Omit<ComponentProps<typeof Button>, "type">) {
	const { submitting } = useFormStatus();
	return <Button {...props} type="submit" loading={loading || submitting} />;
}
export function FormErrorSummary({ errors, title }: { errors: readonly FormError[]; title: string }) {
	const id = useId();
	if (!errors.length) return null;
	return (
		<section className="mds-form-errors" aria-labelledby={id} tabIndex={-1}>
			<h3 id={id}>{title}</h3>
			<ul>
				{errors.map((error, index) => (
					<li key={index}>
						{error.fieldId ? (
							<a
								href={`#${encodeURIComponent(error.fieldId)}`}
								onClick={(event) => {
									const form = event.currentTarget.closest("form");
									if (form && focusField(form, error.fieldId)) event.preventDefault();
								}}
							>
								{error.message}
							</a>
						) : (
							error.message
						)}
					</li>
				))}
			</ul>
		</section>
	);
}
