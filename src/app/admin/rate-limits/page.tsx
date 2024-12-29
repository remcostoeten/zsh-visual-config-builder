"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RateLimitStats } from "@/features/admin/components/analytics/rate-limit-stats";
import { Input, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Table, TableBody, TableHead, TableRow, TableCell, TableHeader } from "@/shared/components/ui";
import { MoreHorizontal, Search, RefreshCw } from "lucide-react";
import { getRateLimits, resetRateLimit } from "@/features/rate-limit/api/mutations";

export default function RateLimitsPage() {
	const [search, setSearch] = useState("");

	const { data: rateLimits, isLoading, refetch } = useQuery({
		queryKey: ["rate-limits", search],
		queryFn: () => getRateLimits(search),
	});

	const handleReset = async (id: number) => {
		try {
			await resetRateLimit(id);
			await refetch();
		} catch (error) {
			console.error("Failed to reset rate limit:", error);
		}
	};

	return (
		<div className="space-y-6">
			<RateLimitStats />

			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<h2 className="text-2xl font-bold">Active Rate Limits</h2>
					<div className="flex items-center gap-2">
						<div className="relative">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search rate limits..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="pl-8"
							/>
						</div>
					</div>
				</div>

				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>User</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Attempts</TableHead>
								<TableHead>Reset At</TableHead>
								<TableHead>Bot Confidence</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ? (
								<TableRow>
									<TableCell colSpan={6} className="text-center h-24">
										Loading...
									</TableCell>
								</TableRow>
							) : rateLimits?.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="text-center h-24">
										No rate limits found
									</TableCell>
								</TableRow>
							) : (
								rateLimits?.map((limit: any) => (
									<TableRow key={limit.id}>
										<TableCell>{limit.identifier}</TableCell>
										<TableCell>{limit.configKey}</TableCell>
										<TableCell>
											{limit.attempts}/{limit.maxAttempts}
										</TableCell>
										<TableCell>
											{new Date(limit.resetAt).toLocaleString()}
										</TableCell>
										<TableCell>
											{limit.botConfidence
												? `${Math.round(limit.botConfidence * 100)}%`
												: "N/A"}
										</TableCell>
										<TableCell>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="outline" className="h-8 w-8 p-0">
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem
														onClick={() => handleReset(limit.id)}
													>
														<RefreshCw className="mr-2 h-4 w-4" />
														Reset Limit
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}
