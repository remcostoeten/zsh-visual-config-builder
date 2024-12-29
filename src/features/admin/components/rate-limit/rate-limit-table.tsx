import { format } from "date-fns";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { RateLimit } from "@/types/rate-limits";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RateLimitTableProps {
	rateLimits: RateLimit[];
	type: "active" | "past";
}

export function RateLimitTable({ rateLimits, type }: RateLimitTableProps) {
	return (
		<div className="rounded-lg border border-neutral-800 bg-black/40">
			<Table>
				<TableHeader>
					<TableRow className="border-neutral-800">
						<TableHead className="text-neutral-400">Config Key</TableHead>
						<TableHead className="text-neutral-400">Attempts</TableHead>
						<TableHead className="text-neutral-400">Last Attempt</TableHead>
						<TableHead className="text-neutral-400">Reset At</TableHead>
						<TableHead className="text-neutral-400">Device</TableHead>
						<TableHead className="text-neutral-400">Location</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{rateLimits.map((limit) => (
						<TableRow key={limit.id} className="border-neutral-800">
							<TableCell className="font-medium text-neutral-200">
								<Badge
									variant="outline"
									className={cn(
										"border-neutral-700 bg-neutral-900",
										type === "active" &&
											"border-red-900/50 bg-red-900/10 text-red-400",
										type === "past" &&
											"border-neutral-700 bg-neutral-900 text-neutral-400",
									)}
								>
									{limit.configKey}
								</Badge>
							</TableCell>
							<TableCell className="text-neutral-200">
								{limit.attempts}
							</TableCell>
							<TableCell className="text-neutral-400">
								{format(new Date(limit.lastAttempt), "MMM d, yyyy HH:mm")}
							</TableCell>
							<TableCell className="text-neutral-400">
								{format(new Date(limit.resetAt), "MMM d, yyyy HH:mm")}
							</TableCell>
							<TableCell className="text-neutral-400">
								{limit.attempts_details[0]?.device || "Unknown"}
							</TableCell>
							<TableCell className="text-neutral-400">
								{limit.attempts_details[0]?.city},{" "}
								{limit.attempts_details[0]?.country}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
