"use client";

import { useFormState } from "react-dom";

export function Form({
	children,
	action,
	className
}) {
	const [state, formAction] = useFormState(action, {
		error: null
	});
	return (
		<form action={formAction} className={className}>
			{children}
			<p>{state.error}</p>
		</form>
	);
}
