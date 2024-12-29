export default function StructuredData() {
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: 'ZSH Config Visual Editor',
		applicationCategory: 'DeveloperApplication',
		operatingSystem: 'Any',
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD',
		},
		description:
			'Visual editor for creating and managing modular ZSH/Bash configurations.',
		author: {
			'@type': 'Person',
			name: 'Remco Stoeten',
			url: 'https://github.com/remcostoeten',
		},
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
		/>
	);
}
