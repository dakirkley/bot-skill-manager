import { RegisterForm } from "@/components/register-form"

export default function RegisterPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Sign Up</h1>
        <RegisterForm />
      </div>
    </div>
  )
}
