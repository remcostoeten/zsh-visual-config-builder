"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { loginWithGitHub, login, register } from "@/services/auth-service";
import { Button } from "@/shared/components/ui";
import { Label } from "@radix-ui/react-label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);

  async function onGitHubLogin() {
    try {
      const url = await loginWithGitHub();
      window.location.href = url;
    } catch (error) {
      toast.error("Failed to login with GitHub");
    }
  }

  async function onRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    try {
      await register({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        name: formData.get("name") as string,
      });
      toast.success("Registration successful! Please check your email for verification.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to register");
    } finally {
      setIsLoading(false);
    }
  }

  async function onLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    try {
      await login({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      });
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to login");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-[400px]">
      <Tabs defaultValue="login" className="w-full">
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
          <CardDescription>Login or create an account to continue.</CardDescription>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <TabsContent value="login">
            <form onSubmit={onLogin}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    disabled={isLoading}
                    required
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Login
                </Button>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="register">
            <form onSubmit={onRegister}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    disabled={isLoading}
                    required
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Register
                </Button>
              </div>
            </form>
          </TabsContent>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={onGitHubLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.gitHub className="mr-2 h-4 w-4" />
            )}
            Continue with GitHub
          </Button>
        </CardFooter>
      </Tabs>
    </Card>
  );
} 