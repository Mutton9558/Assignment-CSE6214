// app/api/staff/students/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    
    // Check if user is authenticated and is staff
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

    // TODO: Replace with actual database query
    // This is mock data
    const students = [
      { id: 1, name: "John Doe", email: "john@example.com", status: "Active" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Active" },
      { id: 3, name: "Bob Johnson", email: "bob@example.com", status: "Inactive" },
    ];

    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}