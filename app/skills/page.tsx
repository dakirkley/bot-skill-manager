import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SkillsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Skills</h1>
      <p>Skills management coming soon...</p>
    </div>
  );
}
