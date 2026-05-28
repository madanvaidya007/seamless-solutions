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
import { Plus, Loader2, ChevronDown } from "lucide-react";
import type { RiskLevel } from "@/lib/risk";
import { BodyDiagnosis } from "@/components/BodyDiagnosis";
import {
  AppointmentsList,
  BloodPressureChart,
  ActivityBars,
  HeartRateCard,
  CalendarStrip,
} from "@/components/HealthPanels";

export const Route = createFileRoute("/patient/")({
  head: () => ({ meta: [{ title: "Health Dashboard — MediTriage AI" }] }),
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
        setItems((data as IntakeRow[]) ?? []);
        setLoading(false);
      });
  }, [user]);

  const latestScore = items[0]?.assessments?.[0]?.risk_score ?? 50;

  return (
    <div className="space-y-5 p-4 md:p-6">
      {/* Top row: Health diagnosis + Calendar/appointments */}
      <div className="grid gap-5 xl:grid-cols-2">
        {/* Health diagnosis */}
        <Card className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Health diagnosis</h2>
            <button className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium">
              This Day <ChevronDown className="h-3 w-3" />
            </button>
          </div>
          <BodyDiagnosis score={latestScore} />
        </Card>

        {/* Calendar + appointments */}
        <Card className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Calendar</h2>
            <span className="text-xs text-muted-foreground">{format(new Date(), "MMM yyyy")}</span>
          </div>
          <CalendarStrip />
          <AppointmentsList />
        </Card>
      </div>

      {/* Middle row: BP + Activity + Heart rate */}
      <div className="grid gap-5 md:grid-cols-3">
        <Card className="md:col-span-1 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Blood pressure</h3>
            <button className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-[11px]">
              Today <ChevronDown className="h-3 w-3" />
            </button>
          </div>
          <BloodPressureChart />
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Your activity</h3>
            <button className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-[11px]">
              Week <ChevronDown className="h-3 w-3" />
            </button>
          </div>
          <ActivityBars />
        </Card>
        <HeartRateCard />
      </div>

      {/* Cases section */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">My cases</h2>
            <p className="text-xs text-muted-foreground">Recent triage assessments</p>
          </div>
          <Link to="/patient/new">
            <Button className="gap-2 shadow-soft">
              <Plus className="h-4 w-4" /> New assessment
            </Button>
          </Link>
        </div>

        <div className="space-y-2">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : items.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No cases yet. Submit your symptoms to get a triage assessment.
              </p>
              <Link to="/patient/new">
                <Button className="mt-4">Start an assessment</Button>
              </Link>
            </Card>
          ) : (
            items.map((it) => {
              const a = it.assessments?.[0];
              return (
                <Link key={it.id} to="/cases/$id" params={{ id: it.id }}>
                  <Card className="flex items-center justify-between gap-4 p-4 transition hover:-translate-y-0.5 hover:shadow-elegant">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{it.chief_complaint}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(it.created_at), "PPp")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {a && <RiskBadge level={a.risk_level} score={a.risk_score} />}
                      <Badge variant="secondary" className="capitalize">
                        {it.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </Card>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
