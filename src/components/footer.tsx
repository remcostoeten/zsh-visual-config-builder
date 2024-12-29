import { Coffee, Heart } from 'lucide-react';
import GithubShinyButton from './effects/github-shiny-button';

export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="fixed bottom-0 left-0 right-0 bg-[#1A1A1A] border-t border-[#333] px-4 py-2 z-40">
			<div className="max-w-[1200px] mx-auto flex items-center justify-between text-sm">
				<div className="flex items-center gap-2 text-gray-400">
					<span>Built with</span>
					<Heart
						className="w-4 h-4 text-red-500 animate-pulse"
						aria-hidden="true"
					/>
					<span>by</span>
					<a
						href="https://github.com/remcostoeten"
						target="_blank"
						rel="noopener noreferrer"
						className="text-gray-300 hover:text-white transition-colors"
						aria-label="Visit Remco Stoeten's GitHub profile"
					>
						@remcostoeten
					</a>
					<span aria-hidden="true">•</span>
					<span>© {currentYear}</span>
				</div>

				<nav className="flex items-center gap-4" aria-label="Footer links">
					<a
						href="https://www.buymeacoffee.com/remcostoeten"
						target="_blank"
						rel="noopener noreferrer"
						className="group flex items-center gap-2 bg-[#FFDD00] hover:bg-[#FFE333] text-[#000000] px-3 py-1 rounded-md transition-all duration-200"
						aria-label="Support this project by buying me a coffee"
					>
						<Coffee
							className="w-4 h-4 group-hover:scale-110 transition-transform"
							aria-hidden="true"
						/>
						<span className="font-medium">Buy me a coffee</span>
					</a>
					<GithubShinyButton />
				</nav>

				{/* Hidden SEO content */}
				<div className="sr-only">
					<h2>About ZSH Config Builder</h2>
					<p>
						A visual editor for creating and managing ZSH and Bash
						configurations. Create, edit, and organize your shell scripts with
						an intuitive drag-and-drop interface.
					</p>
					<p>
						Features include visual node editing, real-time preview, and modular
						configuration management.
					</p>
				</div>
			</div>
		</footer>
	);
}
