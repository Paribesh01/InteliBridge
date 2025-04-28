import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { DashboardTabs } from "@/components/dashboard-tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function Dashboard() {
  const session = await getServerSession();

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
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>New Zap</span>
        </Button>
      </div>
      
      {/* Main dashboard content with tabs */}
      <DashboardTabs />
    </div>
  );
}
    