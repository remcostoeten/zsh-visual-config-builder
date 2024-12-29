"use client";

import { useState } from "react";
import * as FloatingPopovers from "@/components/demo/popovers/floating-popovers";
import { PopoverForm } from "@/shared/components/custom/fForm-popover";

function FloatingPopoversDemo() {
	return (
		<FloatingPopovers.Root>
			<div className="flex gap-4">
				<FloatingPopovers.Trigger title="Add Note">
					Add a Quick Note
				</FloatingPopovers.Trigger>

				<FloatingPopovers.Content>
					<FloatingPopovers.Form
						onSubmit={(note) => console.log("Note:", note)}
					>
						<FloatingPopovers.Body>
							<FloatingPopovers.Label htmlFor="note">
								Write your note
							</FloatingPopovers.Label>
							<FloatingPopovers.Textarea id="note" />
						</FloatingPopovers.Body>
						<FloatingPopovers.Footer>
							<FloatingPopovers.CloseButton />
							<FloatingPopovers.SubmitButton />
						</FloatingPopovers.Footer>
					</FloatingPopovers.Form>
				</FloatingPopovers.Content>
			</div>
		</FloatingPopovers.Root>
	);
}

function FormPopoverDemo() {
	const [open, setOpen] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);

	return (
		<PopoverForm
			open={open}
			setOpen={setOpen}
			title="Feedback"
			showSuccess={showSuccess}
			openChild={
				<div className="p-4">
					<h3 className="text-sm font-medium mb-2">Send Feedback</h3>
					<p className="text-sm text-muted-foreground mb-4">
						Help us improve by sharing your thoughts
					</p>
					<button
						type="button"
						onClick={() => {
							setShowSuccess(true);
							setTimeout(() => {
								setOpen(false);
								setShowSuccess(false);
							}, 2000);
						}}
						className="bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-medium"
					>
						Submit Feedback
					</button>
				</div>
			}
		/>
	);
}

export default function DemoPage() {
	return (
		<div className="container mx-auto p-8">
			<h1 className="text-3xl font-bold mb-8">Component Demos</h1>

			<div className="grid gap-12">
				<section>
					<h2 className="text-2xl font-semibold mb-4">Floating Popovers</h2>
					<div className="p-8 border rounded-lg bg-card">
						<FloatingPopoversDemo />
					</div>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">Form Popover</h2>
					<div className="p-8 border rounded-lg bg-card">
						<FormPopoverDemo />
					</div>
				</section>
			</div>
		</div>
	);
}
