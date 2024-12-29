import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
	title: string;
	value: string | number;
	icon: React.ReactNode;
	description?: string;
}

export function StatsCard({ title, value, icon, description }: StatsCardProps) {
	return (
		<Card className="bg-black/40 border-neutral-800">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium text-neutral-200">
					{title}
				</CardTitle>
				{icon}a
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold text-white">{value}</div>
				{description && (
					<p className="text-xs text-neutral-400 mt-1">{description}</p>
				)}
			</CardContent>
		</Card>
	);
}
