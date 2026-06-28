// app/api/staff/stats/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userRole = session.user?.role?.toLowerCase() || "";
    if (userRole !== "staff" && userRole !== "campus staff") {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // TODO: Replace with actual database queries
    const stats = {
      totalStudents: 1234,
      pendingRequests: 12,
      activeResources: 45,
      upcomingEvents: 8,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}