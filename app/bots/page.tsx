import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BotsList } from "@/components/bots-list";

export default async function BotsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Bots</h1>
      <BotsList />
    </div>
  );
}
