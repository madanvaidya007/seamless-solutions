import { createFileRoute, Link } from "@tanstack/react-router";
import { RequireAuth } from "@/components/RequireAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RiskBadge } from "@/components/RiskBadge";
import { useAuth } from "@/lib/auth";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import type { RiskLevel } from "@/lib/risk";

export const Route = createFileRoute("/doctor/")({
  head: () => ({ meta: [{ title: "Triage Queue — MediTriage AI" }] }),
  component: () => (
    <RequireAuth allowed={["doctor", "admin"]}>
      <DoctorQueue />
    </RequireAuth>
  ),
});

interface QueueRow {
  id: string;
  chief_complaint: string;
  status: string;
  created_at: string;
  patient_id: string;
  profiles: { full_name: string | null; email: string | null } | null;
  assessments: { risk_score: number; risk_level: RiskLevel }[] | null;
}

function DoctorQueue() {
  const { } = useAuth();
  const [items, setItems] = useState<QueueRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"active" | "all">("active");

  useEffect(() => {
    let q = supabase
      .from("patient_intakes")
      .select("id, chief_complaint, status, created_at, patient_id, profiles!patient_intakes_patient_id_fkey(full_name, email), assessments(risk_score, risk_level)");
    if (filter === "active") q = q.in("status", ["pending", "in_review"]);

    q.order("created_at", { ascending: false }).then(({ data }) => {
      const rows = ((data as any) ?? []) as QueueRow[];
      // sort by risk score desc
      rows.sort((a, b) => (b.assessments?.[0]?.risk_score ?? 0) - (a.assessments?.[0]?.risk_score ?? 0));
      setItems(rows);
      setLoading(false);
    });
  }, [filter]);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Triage queue</h1>
          <p className="text-sm text-muted-foreground">Patients sorted by AI risk score.</p>
        </div>
        <div className="flex gap-2">
          <Button variant={filter === "active" ? "default" : "outline"} size="sm" onClick={() => setFilter("active")}>Active</Button>
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>All</Button>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
        ) : items.length === 0 ? (
          <Card className="p-10 text-center text-muted-foreground">No patients in queue.</Card>
        ) : (
          items.map((it) => {
            const a = it.assessments?.[0];
            return (
              <Link key={it.id} to="/cases/$id" params={{ id: it.id }}>
                <Card className="flex items-center justify-between p-5 transition hover:shadow-elegant">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{it.profiles?.full_name || it.profiles?.email || "Patient"}</p>
                      <Badge variant="secondary" className="capitalize">{it.status.replace("_", " ")}</Badge>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">{it.chief_complaint}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(it.created_at), "PPp")}</p>
                  </div>
                  {a && <RiskBadge level={a.risk_level} score={a.risk_score} />}
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
