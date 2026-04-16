import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CredentialsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">API Credentials</h1>
      <p>Credentials management coming soon...</p>
    </div>
  );
}
