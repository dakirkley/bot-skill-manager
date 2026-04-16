import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/dashboard-content";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Bot Skill Manager</h1>
      <DashboardContent />
    </div>
  );
}
