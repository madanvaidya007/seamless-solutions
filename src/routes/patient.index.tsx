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
import { Plus, Loader2 } from "lucide-react";
import type { RiskLevel } from "@/lib/risk";

export const Route = createFileRoute("/patient/")({
  head: () => ({ meta: [{ title: "My Cases — MediTriage AI" }] }),
  component: () => (
    <RequireAuth allowed={["patient", "admin", "doctor"]}>
      <PatientHome />
    </RequireAuth>
  ),
});

interface IntakeRow {
  id: string;
  chief_complaint: string;
  status: string;
  created_at: string;
  assessments: { risk_score: number; risk_level: RiskLevel }[] | null;
}

function PatientHome() {
  const { user } = useAuth();
  const [items, setItems] = useState<IntakeRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("patient_intakes")
      .select("id, chief_complaint, status, created_at, assessments(risk_score, risk_level)")
      .eq("patient_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setItems((data as any) ?? []);
        setLoading(false);
      });
  }, [user]);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">My Cases</h1>
          <p className="text-sm text-muted-foreground">Track your assessments and clinician notes.</p>
        </div>
        <Link to="/patient/new">
          <Button className="gap-2"><Plus className="h-4 w-4" /> New assessment</Button>
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
        ) : items.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="text-muted-foreground">No cases yet. Submit your symptoms to get a triage assessment.</p>
            <Link to="/patient/new">
              <Button className="mt-4">Start an assessment</Button>
            </Link>
          </Card>
        ) : (
          items.map((it) => {
            const a = it.assessments?.[0];
            return (
              <Link key={it.id} to="/cases/$id" params={{ id: it.id }}>
                <Card className="flex items-center justify-between p-5 transition hover:shadow-elegant">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{it.chief_complaint}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(it.created_at), "PPp")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {a && <RiskBadge level={a.risk_level} score={a.risk_score} />}
                    <Badge variant="secondary" className="capitalize">{it.status.replace("_", " ")}</Badge>
                  </div>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
