import { AuthForm } from "@/components/forms/auth-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen px-4 pb-16 pt-32">
      <div className="mx-auto flex max-w-6xl justify-center">
        <AuthForm mode="login" />
      </div>
    </main>
  );
}
