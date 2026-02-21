"use client";
import { toast } from "sonner";
import Header from "@/components/common/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { Calculator, Eye, Lock, NotebookPen, ShieldAlert } from "lucide-react";
import Footer from "@/components/common/footer";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function CustomizeStealthPage() {
  const router = useRouter();
  const userStealth = useUserStore((s) => s.stealth);
  const saveStealth = useUserStore((s) => s.saveStealth);
  const loadStealth = useUserStore((s) => s.loadStealth);
  const [stealthMode, setStealthMode] = useState(userStealth.stealthMode);
  const [rememberWarning, setRememberWarning] = useState("");

  const [stealthType, setStealthType] = useState(
    userStealth.stealthType || "calculator"
  );
  const [dashboardPass, setDashboardPass] = useState(
    userStealth.dashboardPass || ""
  );
  const [sosPass, setSosPass] = useState(userStealth.sosPass || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const cookies = document.cookie.split(";").map((c) => c.trim());
      const remember = cookies.find((c) => c.startsWith("rememberMe="));
      if (!remember || remember.split("=")[1] !== "true") {
        setRememberWarning(
          "Stealth mode requires 'Remember Me' to be active. Please log in again with 'Remember Me' checked."
        );
      }
    }
  }, []);

  useEffect(() => {
    if (!userStealth.stealthType && !userStealth.stealthMode) {
      loadStealth();
    }
  }, [loadStealth, userStealth.stealthType, userStealth.stealthMode]);

  const onSubmit = async () => {
    if (
      dashboardPass &&
      (dashboardPass.length < 4 || dashboardPass.length > 8)
    ) {
      toast.error("Dashboard pass must be 4-8 digits");
      return;
    }
    setSaving(true);
    try {
      await saveStealth({
        stealthMode,
        stealthType,
        dashboardPass: dashboardPass || null,
        sosPass: sosPass || null,
      });
      toast.success("Stealth settings saved");
      router.push("/dashboard");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <main className="max-w-4xl mx-auto p-6 space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Stealth Configuration</h1>
            <p className="text-muted-foreground">Disguise HerGuardian as a harmless utility app.</p>
        </div>

        {rememberWarning && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-sm" role="alert">
                <p className="font-bold">Attention</p>
                <p>{rememberWarning}</p>
            </div>
        )}

        {/* Master Switch */}
        <Card className={cn(stealthMode ? "border-purple-500/50 bg-purple-50/50 dark:bg-purple-950/10 p-4" : "p-4")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-xl">Enable Stealth Mode</CardTitle>
                    <CardDescription>
                        When active, the app will appear as your chosen disguise.
                    </CardDescription>
                </div>
                <Switch 
                    checked={stealthMode} 
                    onCheckedChange={setStealthMode} 
                    disabled={!!rememberWarning}
                />
            </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Appearance Selection */}
            <Card className="p-4">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Eye className="size-5" />
                        Disguise Appearance
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div 
                        className={cn(
                            "cursor-pointer rounded-xl border-2 p-4 transition-all hover:border-purple-500 flex items-center justify-between",
                            stealthType === "calculator" ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20" : "border-transparent bg-muted"
                        )}
                        onClick={() => setStealthType("calculator")}
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-white">
                                <Calculator className="size-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Calculator</h3>
                                <p className="text-xs text-muted-foreground">Functional calculator app</p>
                            </div>
                        </div>
                        {stealthType === "calculator" && <div className="h-4 w-4 rounded-full bg-purple-600" />}
                    </div>

                    <div 
                         className={cn(
                            "cursor-pointer rounded-xl border-2 p-4 transition-all hover:border-purple-500 flex items-center justify-between",
                            stealthType === "notes" ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20" : "border-transparent bg-muted"
                        )}
                        onClick={() => setStealthType("notes")}
                    >
                         <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center text-white">
                                <NotebookPen className="size-6 text-yellow-900" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Notes</h3>
                                <p className="text-xs text-muted-foreground">Private notepad app</p>
                            </div>
                        </div>
                        {stealthType === "notes" && <div className="h-4 w-4 rounded-full bg-purple-600" />}
                    </div>
                </CardContent>
            </Card>

            {/* Triggers */}
            <Card className="p-4">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="size-5" />
                        Secret Triggers
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Dashboard Passcode</Label>
                        <Input 
                            type="password" 
                            placeholder="e.g. 1234"
                            maxLength={8}
                            value={dashboardPass}
                            onChange={(e) => setDashboardPass(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            Type this in the app to unlock your real dashboard.
                        </p>
                    </div>

                    <div className="space-y-2">
                         <Label className="text-red-500 flex items-center gap-1">
                            <ShieldAlert className="size-3" />
                            SOS Trigger
                        </Label>
                        <Input 
                            type="text" 
                            placeholder="e.g. helpme"
                            maxLength={20}
                            value={sosPass}
                            onChange={(e) => setSosPass(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            Type this to silently trigger an SOS alert.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pb-10">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
                Cancel
            </Button>
            <Button onClick={onSubmit} disabled={saving} className="bg-purple-600 hover:bg-purple-700 min-w-[140px]">
                {saving ? "Saving..." : "Save Settings"}
            </Button>
        </div>

      </main>
      <Footer />
    </div>
  );
}
