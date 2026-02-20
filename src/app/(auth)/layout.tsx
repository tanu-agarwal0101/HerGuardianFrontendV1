import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await cookies();
  const hasAccess = store.get("accessToken");
  const hasRefresh = store.get("refreshToken");
  if (hasAccess || hasRefresh) {
    redirect("/dashboard");
  }
  return <>{children}</>;
}
