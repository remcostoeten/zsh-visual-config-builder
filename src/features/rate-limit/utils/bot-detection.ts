"use client";

type BotDetectionResult = {
	isBot: boolean;
	confidence: number;
	reasons: string[];
};

/**
 * Advanced bot patterns including known bot signatures and automation tools
 */
const BOT_PATTERNS = {
	KNOWN_BOTS: [
		"bot",
		"spider",
		"crawler",
		"scraper",
		"indexer",
		"googlebot",
		"bingbot",
		"yandexbot",
		"duckduckbot",
		"baiduspider",
		"sogou",
		"360spider",
		"semrushbot",
	],
	AUTOMATION_TOOLS: [
		"selenium",
		"puppeteer",
		"playwright",
		"phantomjs",
		"cypress",
		"webdriver",
		"chromedriver",
		"geckodriver",
	],
	HTTP_LIBRARIES: [
		"python",
		"ruby",
		"curl",
		"wget",
		"postman",
		"insomnia",
		"apache-httpclient",
		"java",
		"axios",
		"got",
		"request",
	],
	HEADLESS: ["headless", "prerender", "chrome-lighthouse"],
};

/**
 * Check for common bot headers
 */
const checkBotHeaders = (headers: Record<string, string>): string[] => {
	const suspicious = [];

	if (!headers["user-agent"]) suspicious.push("Missing User-Agent");
	if (!headers["accept-language"]) suspicious.push("Missing Accept-Language");
	if (headers["accept"] === "*/*") suspicious.push("Generic Accept header");

	return suspicious;
};

/**
 * Check for automation tool signatures
 */
const checkAutomationTools = (userAgent: string): string[] => {
	const found = [];

	for (const [category, patterns] of Object.entries(BOT_PATTERNS)) {
		for (const pattern of patterns) {
			if (userAgent.toLowerCase().includes(pattern.toLowerCase())) {
				found.push(`${category}: ${pattern}`);
			}
		}
	}

	return found;
};

/**
 * Check for suspicious browser features
 */
const checkBrowserFeatures = (): string[] => {
	const suspicious = [];

	if (typeof window === "undefined") return ["Server-side execution"];

	// Check for WebDriver
	if ((navigator as any).webdriver) suspicious.push("WebDriver detected");

	// Check for Chrome automation
	if ((window as any).chrome && (window as any).chrome.automation) {
		suspicious.push("Chrome automation detected");
	}

	// Check for common bot behaviors
	if (!navigator.plugins.length) suspicious.push("No plugins");
	if (!navigator.languages?.length) suspicious.push("No languages");
	if (navigator.hardwareConcurrency === 1) suspicious.push("Single core CPU");

	// Check for headless mode indicators
	const suspicious_props = [
		"callPhantom",
		"_phantom",
		"__nightmare",
		"_selenium",
		"__webdriver_evaluate",
		"__selenium_evaluate",
		"__webdriver_script_fn",
	];

	for (const prop of suspicious_props) {
		if ((window as any)[prop]) {
			suspicious.push(`Automation property detected: ${prop}`);
		}
	}

	return suspicious;
};

/**
 * Advanced bot detection with confidence scoring
 */
export const detectBot = (
	userAgent: string,
	headers: Record<string, string> = {},
): BotDetectionResult => {
	const reasons: string[] = [];
	let confidence = 0;

	// Check headers
	const suspiciousHeaders = checkBotHeaders(headers);
	reasons.push(...suspiciousHeaders);
	confidence += suspiciousHeaders.length * 0.2; // 20% per suspicious header

	// Check automation tools
	const automationSigns = checkAutomationTools(userAgent);
	reasons.push(...automationSigns);
	confidence += automationSigns.length * 0.3; // 30% per automation sign

	// Check browser features
	const suspiciousFeatures = checkBrowserFeatures();
	reasons.push(...suspiciousFeatures);
	confidence += suspiciousFeatures.length * 0.25; // 25% per suspicious feature

	// Normalize confidence to 0-1 range
	confidence = Math.min(confidence, 1);

	return {
		isBot: confidence > 0.5, // Consider it a bot if confidence > 50%
		confidence,
		reasons,
	};
};
