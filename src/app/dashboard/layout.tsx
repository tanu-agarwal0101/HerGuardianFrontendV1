import type { Metadata } from "next";
// import { ToastSetup } from "./toast-setup";
import RequireAuth from "@/components/common/RequireAuth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export const metadata: Metadata = {
  title: "Her Guardian | Dashboard",
  description: "Your safety command center.",
};

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <ToastSetup /> */}
      <RequireAuth>
        <DashboardLayout>{children}</DashboardLayout>
      </RequireAuth>
    </>
  );
}
