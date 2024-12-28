"use client";

import { useEffect, useState } from "react";
import { RateLimitEventService } from "@/features/rate-limit/server/service";
import dynamic from "next/dynamic";
import { format } from "date-fns";
import { useAuth } from "@/features/auth/hooks/use-auth";

// Lazy load the map component
const LocationMapWithNoSSR = dynamic(
	() => import("@/components/map").then((mod) => mod.LocationMap),
	{ ssr: false },
);

interface RateLimitEvent {
	id: string;
	createdAt: Date;
	type: string;
	userEmail?: string;
	attemptCount: number;
	lockedUntil?: Date;
	deviceType: string;
	operatingSystem: string;
	browser: string;
	country?: string;
	city?: string;
	latitude?: string;
	longitude?: string;
	automationScore: number;
	seemsAutomated: boolean;
}

export default function AdminRateLimits() {
	const { user } = useAuth();
	const [events, setEvents] = useState<RateLimitEvent[]>([]);
	const [selectedEvent, setSelectedEvent] = useState<RateLimitEvent | null>(null);
	const [isMapOpen, setIsMapOpen] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		const checkAdmin = async () => {
			try {
				const response = await fetch('/api/admin/check');
				const data = await response.json();
				setIsAdmin(data.isAdmin);
				
				if (data.isAdmin) {
					const service = new RateLimitEventService();
					const eventData = await service.getRateLimitHistory();
					setEvents(eventData);
				}
			} catch (error) {
				console.error('Failed to check admin status:', error);
				setIsAdmin(false);
			}
		};

		if (user) {
			checkAdmin();
		}
	}, [user]);

	if (!user || !isAdmin) {
		return (
			<div className="container mx-auto py-8">
				<h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
				<p>You must be an admin to view this page.</p>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8">
			<h1 className="text-3xl font-bold mb-6">Rate Limit Events</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
				{/* Stats Cards */}
				<div className="bg-card p-6 rounded-lg shadow">
					<h3 className="text-lg font-semibold mb-2">Active Rate Limits</h3>
					<p className="text-3xl font-bold">
						{events.filter(e => e.lockedUntil && new Date(e.lockedUntil) > new Date()).length}
					</p>
				</div>
				<div className="bg-card p-6 rounded-lg shadow">
					<h3 className="text-lg font-semibold mb-2">Automated Attempts</h3>
					<p className="text-3xl font-bold">
						{events.filter(e => e.seemsAutomated).length}
					</p>
				</div>
				<div className="bg-card p-6 rounded-lg shadow">
					<h3 className="text-lg font-semibold mb-2">Total Events</h3>
					<p className="text-3xl font-bold">{events.length}</p>
				</div>
			</div>

			{/* Events Table */}
			<div className="bg-card rounded-lg shadow overflow-hidden">
				<table className="w-full">
					<thead>
						<tr className="bg-muted">
							<th className="p-4 text-left">Time</th>
							<th className="p-4 text-left">Type</th>
							<th className="p-4 text-left">User</th>
							<th className="p-4 text-left">Device</th>
							<th className="p-4 text-left">Location</th>
							<th className="p-4 text-left">Score</th>
							<th className="p-4 text-left">Actions</th>
						</tr>
					</thead>
					<tbody>
						{events.map(event => (
							<tr key={event.id} className="border-t border-border">
								<td className="p-4">
									{format(new Date(event.createdAt), 'MMM d, HH:mm:ss')}
								</td>
								<td className="p-4">{event.type}</td>
								<td className="p-4">{event.userEmail || 'Anonymous'}</td>
								<td className="p-4">
									{event.deviceType} ({event.operatingSystem})
								</td>
								<td className="p-4">
									{event.country ? (
										<button
											type="button"
											className="text-primary hover:underline"
											onClick={() => {
												setSelectedEvent(event);
												setIsMapOpen(true);
											}}
										>
											{event.city}, {event.country}
										</button>
									) : (
										'Unknown'
									)}
								</td>
								<td className="p-4">
									<span
										className={`px-2 py-1 rounded-full text-sm ${
											event.automationScore > 70
												? 'bg-destructive/20 text-destructive'
												: 'bg-muted text-muted-foreground'
										}`}
									>
										{event.automationScore}
									</span>
								</td>
								<td className="p-4">
									<button
										type="button"
										className="text-sm text-primary hover:underline"
										onClick={() => setSelectedEvent(event)}
									>
										Details
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Map Modal */}
			{isMapOpen && selectedEvent && (
				<div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
					<div className="fixed inset-x-4 top-[50%] translate-y-[-50%] max-w-2xl mx-auto bg-card rounded-lg shadow-lg p-6">
						<h2 className="text-xl font-semibold mb-4">
							Location: {selectedEvent.city}, {selectedEvent.country}
						</h2>
						<div className="h-[400px] rounded-lg overflow-hidden mb-4">
							<LocationMapWithNoSSR
								center={[
									Number.parseFloat(selectedEvent.latitude || '0'),
									Number.parseFloat(selectedEvent.longitude || '0'),
								]}
								zoom={12}
								markers={[
									{
										id: selectedEvent.id,
										position: [
											Number.parseFloat(selectedEvent.latitude || '0'),
											Number.parseFloat(selectedEvent.longitude || '0'),
										],
										popup: `${selectedEvent.city}, ${selectedEvent.country}`,
									},
								]}
							/>
						</div>
						<button
							type="button"
							className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
							onClick={() => setIsMapOpen(false)}
						>
							Close
						</button>
					</div>
				</div>
			)}

			{/* Details Modal */}
			{selectedEvent && !isMapOpen && (
				<div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
					<div className="fixed inset-x-4 top-[50%] translate-y-[-50%] max-w-2xl mx-auto bg-card rounded-lg shadow-lg p-6">
						<h2 className="text-xl font-semibold mb-4">Event Details</h2>
						<div className="space-y-4">
							<div>
								<h3 className="font-medium">Timing</h3>
								<p>Created: {format(new Date(selectedEvent.createdAt), 'PPpp')}</p>
								{selectedEvent.lockedUntil && (
									<p>
										Locked until:{' '}
										{format(new Date(selectedEvent.lockedUntil), 'PPpp')}
									</p>
								)}
							</div>
							<div>
								<h3 className="font-medium">Device Information</h3>
								<p>Type: {selectedEvent.deviceType}</p>
								<p>OS: {selectedEvent.operatingSystem}</p>
								<p>Browser: {selectedEvent.browser}</p>
							</div>
							<div>
								<h3 className="font-medium">Analysis</h3>
								<p>Automation Score: {selectedEvent.automationScore}</p>
								<p>
									Assessment:{' '}
									{selectedEvent.seemsAutomated
										? 'Likely automated'
										: 'Likely genuine'}
								</p>
							</div>
						</div>
						<div className="mt-6">
							<button
								type="button"
								className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
								onClick={() => setSelectedEvent(null)}
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
