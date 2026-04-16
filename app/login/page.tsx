import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}
