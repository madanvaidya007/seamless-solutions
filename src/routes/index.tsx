import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Activity, Brain, ShieldCheck, Stethoscope, Timer, Workflow } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MediTriage AI — Smart Triage & Clinical Decision Support" },
      { name: "description", content: "Reduce diagnostic delays and prioritize high-risk patients with AI-assisted triage built for hospitals." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-subtle">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              LAKSHYAVEDH 2K26 · Clinical Decision Support
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              AI triage that helps doctors
              <span className="block bg-gradient-hero bg-clip-text text-transparent">see the right patient first.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              MediTriage AI combines a transparent rule-based risk engine with
              AI-assisted differentials to support clinicians during high-volume
              clinics — without replacing clinical judgment.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/auth/sign-up">
                <Button size="lg" className="shadow-elegant">Start free</Button>
              </Link>
              <Link to="/auth/sign-in">
                <Button size="lg" variant="outline">I have an account</Button>
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              For research and decision support only — not a medical device.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Built for busy clinics</h2>
          <p className="mt-3 text-muted-foreground">
            Every input is validated, every assessment is auditable, and every
            risk score is explainable.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: Brain, title: "Hybrid AI engine", body: "Rule-based scoring with red-flag detection plus AI-generated differentials and rationales." },
            { icon: Timer, title: "Fast triage", body: "Sub-second risk scoring; AI summary returned in seconds via secure edge functions." },
            { icon: ShieldCheck, title: "Privacy first", body: "Row-level security, role-based access, audit logs, and signed sessions on every request." },
            { icon: Stethoscope, title: "Doctor cockpit", body: "Patients sorted by risk. Review, override, and document in one workflow." },
            { icon: Workflow, title: "Workflow ready", body: "Patient self-intake, clinician review, exportable PDF reports for the chart." },
            { icon: Activity, title: "Explainable scores", body: "Every point in the risk score is broken down so you can trust — and challenge — the output." },
          ].map((f) => (
            <Card key={f.title} className="p-6 shadow-card transition hover:shadow-elegant">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-20">
        <Card className="overflow-hidden border-0 bg-gradient-hero p-10 text-center text-primary-foreground shadow-elegant">
          <h3 className="text-2xl font-semibold">Try the live triage demo</h3>
          <p className="mx-auto mt-2 max-w-xl text-primary-foreground/80">
            Create an account as a patient or clinician and walk through a full
            symptom-to-assessment flow in under a minute.
          </p>
          <div className="mt-6">
            <Link to="/auth/sign-up">
              <Button size="lg" variant="secondary">Create account</Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
