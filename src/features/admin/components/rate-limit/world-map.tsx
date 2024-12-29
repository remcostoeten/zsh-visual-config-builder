import { useMemo } from "react";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";
import Map from "react-map-gl";
import { RateLimit } from "@/types/rate-limits";

const MAPBOX_DARK_STYLE =
	"https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

interface ActivityMapProps {
	rateLimits: RateLimit[];
}

export function ActivityMap({ rateLimits }: ActivityMapProps) {
	const points = useMemo(() => {
		return rateLimits.flatMap((limit) =>
			limit.attempts_details.map((detail) => ({
				coordinates: [
					parseFloat(detail.longitude),
					parseFloat(detail.latitude),
				],
				attempts: limit.attempts,
				configKey: limit.configKey,
			})),
		);
	}, [rateLimits]);

	const layers = [
		new ScatterplotLayer({
			id: "scatter",
			data: points,
			pickable: true,
			opacity: 0.8,
			stroked: false,
			filled: true,
			radiusScale: 6,
			radiusMinPixels: 3,
			radiusMaxPixels: 30,
			lineWidthMinPixels: 1,
			getPosition: (d) => d.coordinates,
			getRadius: (d) => Math.sqrt(d.attempts) * 5,
			getFillColor: (d) =>
				d.configKey === "auth" ? [255, 0, 0, 140] : [0, 140, 255, 140],
			// Glowing effect
			parameters: {
				blend: true,
				blendFunc: ["SRC_ALPHA", "ONE"],
				depthTest: false,
			},
			// Render twice for glow effect
			updateTriggers: {
				getFillColor: points.map((p) => p.configKey),
			},
		}),
	];

	return (
		<div className="h-[400px] rounded-lg overflow-hidden border border-neutral-800">
			<DeckGL
				initialViewState={{
					longitude: 4.9041,
					latitude: 52.3676,
					zoom: 3,
					pitch: 0,
					bearing: 0,
				}}
				controller={true}
				layers={layers}
			>
				<Map mapStyle={MAPBOX_DARK_STYLE} attributionControl={false} />
			</DeckGL>
		</div>
	);
}
