import Login from "@/app/login/page";
import { redirect } from "next/navigation";
import { auth } from "@/auth"

export default async function page() {
  const isAuthenticated = await auth();
  
  if (isAuthenticated) {
    redirect("/dashboard");
  } else {
    return <Login />;
  }
}