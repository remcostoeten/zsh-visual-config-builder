"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Ban, Bot, Users, AlertTriangle } from "lucide-react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import {
	getRateLimitStats,
	getRateLimitTrends,
} from "@/features/rate-limit/api/queries";

type RateLimitStats = {
	activeLimits: number;
	activeChange: number;
	botAttempts: number;
	botAttemptsChange: number;
	uniqueUsers: number;
	topEndpoints: Array<{
		configKey: string;
		attempts: number;
		change: number;
	}>;
	geoDistribution: Array<{
		country: string | null;
		attempts: number;
		percentage: number;
	}>;
};

type RateLimitTrend = {
	time: string;
	attempts: number;
	botAttempts: number;
};

export function RateLimitStats() {
	const { data: stats, isLoading } = useQuery<RateLimitStats, Error>({
		queryKey: ["rate-limit-stats"],
		queryFn: getRateLimitStats,
	});

	const { data: trends } = useQuery<RateLimitTrend[], Error>({
		queryKey: ["rate-limit-trends"],
		queryFn: getRateLimitTrends,
	});

	if (isLoading) return <div>Loading...</div>;

	return (
		<div className="space-y-4">
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Active Rate Limits
						</CardTitle>
						<Ban className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats?.activeLimits || 0}</div>
						<p className="text-xs text-muted-foreground">
							{stats?.activeChange !== undefined ? `${stats.activeChange > 0 ? "+" : ""}${stats.activeChange}% from last hour` : "No change"}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Bot Attempts</CardTitle>
						<Bot className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats?.botAttempts || 0}</div>
						<p className="text-xs text-muted-foreground">
							{stats?.botAttemptsChange !== undefined ? `${stats.botAttemptsChange > 0 ? "+" : ""}${stats.botAttemptsChange}% from last hour` : "No change"}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Unique Users</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats?.uniqueUsers || 0}</div>
						<p className="text-xs text-muted-foreground">
							No change data available
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Attempts
						</CardTitle>
						<AlertTriangle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{trends?.[trends.length - 1]?.attempts || 0}</div>
						<p className="text-xs text-muted-foreground">
							Last hour
						</p>
					</CardContent>
				</Card>
			</div>

			<Card className="col-span-4">
				<CardHeader>
					<CardTitle>Rate Limit Trends</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="h-[200px]">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={trends || []}>
								<CartesianGrid strokeDasharray="3 3" />
								{/* @ts-ignore */}
								<XAxis dataKey="time" />
								{/* @ts-ignore */}
								<YAxis />
								{/* @ts-ignore */}
								<Tooltip />
								{/* @ts-ignore */}
								<Line
									type="monotone"
									dataKey="attempts"
									stroke="#8884d8"
									name="Attempts"
									isAnimationActive={false}
								/>
								{/* @ts-ignore */}
								<Line
									type="monotone"
									dataKey="botAttempts"
									stroke="#82ca9d"
									name="Bot Attempts"
									isAnimationActive={false}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				</CardContent>
			</Card>

			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Top Rate Limited Endpoints</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{stats?.topEndpoints?.map((endpoint) => (
								<div key={endpoint.configKey} className="flex items-center">
									<div className="flex-1 space-y-1">
										<p className="text-sm font-medium">{endpoint.configKey}</p>
										<div className="text-xs text-muted-foreground">
											{endpoint.attempts} attempts
										</div>
									</div>
									<div
										className={`ml-2 text-xs ${
											endpoint.change > 0 ? "text-green-500" : "text-red-500"
										}`}
									>
										{endpoint.change > 0 ? "+" : ""}
										{endpoint.change}%
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Geographic Distribution</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{stats?.geoDistribution?.map((geo) => (
								<div key={geo.country || 'unknown'} className="flex items-center">
									<div className="flex-1 space-y-1">
										<p className="text-sm font-medium">{geo.country || 'Unknown'}</p>
										<div className="text-xs text-muted-foreground">
											{geo.attempts} attempts
										</div>
									</div>
									<div className="ml-2 text-xs">{geo.percentage}%</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
