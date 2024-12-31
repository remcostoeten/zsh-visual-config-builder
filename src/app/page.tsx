import { AuthForm } from "@/features/auth/components/auth-form";
import { getUser } from "@/services/auth-service";

export default async function HomePage() {
	const user = await getUser();

	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-4">
			<div className="space-y-6 text-center">
				<h1 className="text-4xl font-bold tracking-tight">ZSH Config Builder</h1>
				<p className="text-muted-foreground">
					Build your ZSH configuration visually. Login to get started.
				</p>
			</div>
			{!user ? (
				<div className="mt-8">
					<AuthForm />
				</div>
			) : (
				<div className="mt-8 space-y-4">
					<p className="text-xl">Welcome back, {user.login}!</p>
					<p className="text-muted-foreground">
						Start building your ZSH configuration.
					</p>
				</div>
			)}
		</main>
	);
}
