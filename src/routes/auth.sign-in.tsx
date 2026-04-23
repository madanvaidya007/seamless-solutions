import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { signInSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth/sign-in")({
  head: () => ({ meta: [{ title: "Sign in — MediTriage AI" }] }),
  component: SignIn,
});

function SignIn() {
  const navigate = useNavigate();
  const { refreshRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signInSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error, data } = await supabase.auth.signInWithPassword(form);
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    await refreshRole();
    const { data: roleData } = await supabase.rpc("get_primary_role", { _user_id: data.user!.id });
    toast.success("Welcome back");
    if (roleData === "doctor" || roleData === "admin") navigate({ to: "/doctor" });
    else navigate({ to: "/patient" });
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-12">
      <Card className="w-full p-8 shadow-elegant">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">Continue to your dashboard.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link to="/auth/sign-up" className="text-primary hover:underline">Create an account</Link>
        </p>
      </Card>
    </div>
  );
}
