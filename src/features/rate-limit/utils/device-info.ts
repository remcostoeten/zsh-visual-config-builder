"use client";

import { UAParser } from "ua-parser-js";
import { DeviceInfoError, handleError } from "@/lib/utils/error-handler";

export type DeviceInfo = {
	userAgent: string;
	browser: string;
	browserVersion: string;
	os: string;
	osVersion: string;
	device: string;
	deviceType: string;
	ip: string;
	timeBetweenAttempts?: number;
	country?: string;
	region?: string;
	city?: string;
	latitude?: string;
	longitude?: string;
	timezone?: string;
	isp?: string;
	asn?: string;
	isProxy: boolean;
	isVpn: boolean;
	isTor: boolean;
	// Additional security features
	screenResolution?: string;
	colorDepth?: number;
	language?: string;
	doNotTrack?: boolean;
	cookiesEnabled?: boolean;
	touchSupport?: boolean;
	batteryLevel?: number;
	networkType?: string;
	memoryInfo?: string;
};

/**
 * Check if the request is likely from a bot
 */
const detectBot = (userAgent: string): boolean => {
	const botPatterns = [
		"bot",
		"spider",
		"crawler",
		"selenium",
		"puppeteer",
		"headless",
		"python",
		"curl",
		"wget",
		"phantom",
		"postman",
	];
	return botPatterns.some((pattern) =>
		userAgent.toLowerCase().includes(pattern),
	);
};

/**
 * Get network connection information
 */
const getNetworkInfo = (): { type: string; effectiveType: string } => {
	if (typeof navigator === "undefined" || !("connection" in navigator)) {
		return { type: "unknown", effectiveType: "unknown" };
	}

	const connection = (navigator as any).connection;
	return {
		type: connection?.type || "unknown",
		effectiveType: connection?.effectiveType || "unknown",
	};
};

/**
 * Get battery information if available
 */
const getBatteryInfo = async (): Promise<number | null> => {
	if (typeof navigator === "undefined" || !("getBattery" in navigator)) {
		return null;
	}

	try {
		const battery = await (navigator as any).getBattery();
		return battery.level;
	} catch {
		return null;
	}
};

/**
 * Get detailed information about the current device and network
 */
export const getDeviceInfo = async (): Promise<DeviceInfo> => {
	try {
		const parser = new UAParser(window.navigator.userAgent);
		const browser = parser.getBrowser();
		const os = parser.getOS();
		const device = parser.getDevice();
		const network = getNetworkInfo();
		const batteryLevel = await getBatteryInfo();

		// Get IP and location info
		let geoData = {};
		try {
			const response = await fetch("https://ipapi.co/json/");
			if (!response.ok) {
				throw new DeviceInfoError("Failed to fetch geo data", {
					metadata: { status: response.status },
				});
			}
			geoData = await response.json();
		} catch (error) {
			await handleError(error as Error, {
				metadata: { component: "getDeviceInfo", subComponent: "geoData" },
			});
		}

		// Get memory info if available
		const memory = (performance as any).memory
			? {
					totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
					usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
				}
			: null;

		const deviceInfo: DeviceInfo = {
			userAgent: window.navigator.userAgent,
			browser: browser.name || "Unknown",
			browserVersion: browser.version || "Unknown",
			os: os.name || "Unknown",
			osVersion: os.version || "Unknown",
			device: device.model || device.type || "Unknown",
			deviceType: device.type || "desktop",
			ip: (geoData as any).ip || "Unknown",
			country: (geoData as any).country_name,
			region: (geoData as any).region,
			city: (geoData as any).city,
			latitude: (geoData as any).latitude?.toString(),
			longitude: (geoData as any).longitude?.toString(),
			timezone: (geoData as any).timezone,
			isp: (geoData as any).org,
			asn: (geoData as any).asn,
			isProxy: (geoData as any).proxy || false,
			isVpn: (geoData as any).vpn || false,
			isTor: (geoData as any).tor || false,

			// Additional security features
			screenResolution: `${window.screen.width}x${window.screen.height}`,
			colorDepth: window.screen.colorDepth,
			language: navigator.language,
			doNotTrack: navigator.doNotTrack === "1",
			cookiesEnabled: navigator.cookieEnabled,
			touchSupport: "ontouchstart" in window,
			batteryLevel: batteryLevel || undefined,
			networkType: `${network.type}/${network.effectiveType}`,
			memoryInfo: memory ? JSON.stringify(memory) : undefined,
		};

		// Check for bot patterns
		if (detectBot(deviceInfo.userAgent)) {
			await handleError(
				new DeviceInfoError("Bot detected", {
					metadata: { deviceInfo },
				}),
			);
		}

		return deviceInfo;
	} catch (error) {
		const appError = new DeviceInfoError("Failed to get device info", {
			metadata: {
				error: error instanceof Error ? error.message : "Unknown error",
			},
		});
		await handleError(appError);

		// Return basic info even if detailed info fails
		return {
			userAgent: window.navigator.userAgent,
			browser: "Unknown",
			browserVersion: "Unknown",
			os: "Unknown",
			osVersion: "Unknown",
			device: "Unknown",
			deviceType: "unknown",
			ip: "Unknown",
			isProxy: false,
			isVpn: false,
			isTor: false,
		};
	}
};
