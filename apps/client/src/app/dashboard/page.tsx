import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { DashboardTabs } from "@/components/dashboard-tabs";
import { CreateZapButton } from "@/components/create-zap-button";
import { authOptions } from "@/modules/auth/authOptions";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  console.log("session", session?.user?.jwtToken);
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container py-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Zaps</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor your automated workflows
          </p>
        </div>
        <CreateZapButton />
      </div>

      {/* Main dashboard content with tabs */}
      <DashboardTabs />
    </div>
  );
}
