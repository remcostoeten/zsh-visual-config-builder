import { AuthButton } from "@/features/auth/components/auth-button";
import Image from "next/image";

export default function Home() {
	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<AuthButton isLoggedIn={false} />
			<main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
				<div 
					className="absolute inset-0 z-0" 
					style={{
						backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url('/ray.webp')`,
						backgroundSize: '',
						backgroundPosition: 'center',
						opacity: 0.6,
					}}
				/>
			</main>s
		</div>
	);
}
