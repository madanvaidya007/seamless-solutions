import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/RequireAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { lazy, Suspense } from "react";

const Charts = lazy(() => import("@/components/AdminCharts"));

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin — MediTriage AI" }] }),
  component: () => (
    <RequireAuth allowed={["admin"]}>
      <Admin />
    </RequireAuth>
  ),
});

function Admin() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalIntakes: 0,
    totalAssessments: 0,
    avgScore: 0,
    riskBuckets: [] as { name: string; value: number }[],
    perDay: [] as { day: string; count: number }[],
    audit: [] as any[],
  });

  useEffect(() => {
    (async () => {
      const [{ count: usersC }, { count: intakesC }, { data: assess }, { data: audit }] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("patient_intakes").select("*", { count: "exact", head: true }),
        supabase.from("assessments").select("risk_score, risk_level, created_at"),
        supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(20),
      ]);

      const buckets: Record<string, number> = { low: 0, moderate: 0, high: 0, critical: 0 };
      let sum = 0;
      const perDayMap: Record<string, number> = {};
      (assess || []).forEach((a: any) => {
        buckets[a.risk_level]++;
        sum += a.risk_score;
        const d = format(new Date(a.created_at), "MMM d");
        perDayMap[d] = (perDayMap[d] || 0) + 1;
      });

      setStats({
        totalUsers: usersC || 0,
        totalIntakes: intakesC || 0,
        totalAssessments: (assess || []).length,
        avgScore: assess && assess.length ? Math.round(sum / assess.length) : 0,
        riskBuckets: Object.entries(buckets).map(([name, value]) => ({ name, value })),
        perDay: Object.entries(perDayMap).map(([day, count]) => ({ day, count })),
        audit: audit || [],
      });
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Admin dashboard</h1>
      <p className="text-sm text-muted-foreground">System overview and audit trail.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Stat label="Users" value={stats.totalUsers} />
        <Stat label="Intakes" value={stats.totalIntakes} />
        <Stat label="Assessments" value={stats.totalAssessments} />
        <Stat label="Avg risk score" value={stats.avgScore} />
      </div>

      <div className="mt-6">
        <Suspense fallback={<div className="h-64 flex items-center justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>}>
          <Charts perDay={stats.perDay} riskBuckets={stats.riskBuckets} />
        </Suspense>
      </div>

      <Card className="mt-6 p-5">
        <h2 className="font-semibold">Recent audit log</h2>
        <div className="mt-3 divide-y text-sm">
          {stats.audit.length === 0 ? <p className="py-4 text-muted-foreground">No activity yet.</p> :
            stats.audit.map((a: any) => (
              <div key={a.id} className="flex items-center justify-between py-2.5">
                <div>
                  <span className="font-medium">{a.action}</span>
                  <span className="ml-2 text-muted-foreground">{a.resource_type}</span>
                </div>
                <span className="text-xs text-muted-foreground">{format(new Date(a.created_at), "PPp")}</span>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card className="p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </Card>
  );
}
