import { AuthForm } from "@/features/auth/components/auth-form";
import { getUser } from "@/services/auth-service";
import { redirect } from "next/navigation";

export default async function AuthPage() {
  const user = await getUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <AuthForm />
    </div>
  );
} 