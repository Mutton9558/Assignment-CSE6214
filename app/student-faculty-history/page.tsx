"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavBar, { NavItem } from "../components/NavBar";
import { LuHouse, LuCalendarPlus, LuUsers } from "react-icons/lu";
import { MdOutlinePerson } from "react-icons/md";
import { fetchAllBooking } from "../actions/BookingController";
import { getUserProfile } from "../actions/userActions";

interface Booking {
  id: string;
  resource: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface Student {
  id: string;
  name: string;
  faculty: string;
  matric: string;
  bookings: Booking[];
}

export default function StudentFacultyHistoryPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [selected, setSelected] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllStudentsWithBookings();
  }, []);

  const fetchAllStudentsWithBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all bookings from the database using the controller
      const allBookings = await fetchAllBooking();
      
      if (!allBookings || allBookings.length === 0) {
        setStudents([]);
        setLoading(false);
        return;
      }

      // Group bookings by student
      const studentMap = new Map<string, { 
        id: string; 
        name: string; 
        faculty: string; 
        matric: string; 
        bookings: Booking[] 
      }>();

      // Process each booking
      for (const booking of allBookings) {
        // Get student ID from booking_owner
        const studentId = booking.booking_owner?.user_id;
        if (!studentId) continue;

        // Get student data from booking_owner
        const studentData = booking.booking_owner;
        
        // If student not in map yet, create entry
        if (!studentMap.has(studentId)) {
          let faculty = "Unknown Faculty";
          
          try {
            // Fetch full user profile to get department/faculty
            const userProfile = await getUserProfile(studentId);
            if (userProfile) {
              faculty = userProfile.department || "Unknown Faculty";
            }
          } catch (err) {
            console.error(`Failed to fetch profile for ${studentId}:`, err);
          }

          studentMap.set(studentId, {
            id: studentId,
            name: studentData?.name || "Unknown Student",
            faculty: faculty,
            matric: studentId, // Using student ID as matric
            bookings: []
          });
        }

        // Add booking to student's list
        const student = studentMap.get(studentId)!;
        
        // Format the booking data
        const bookingStart = booking.booking_start;
        const bookingEnd = booking.booking_end;
        
        student.bookings.push({
          id: booking.booking_id || "",
          resource: booking.resource?.resource_name || "Unknown Resource",
          date: bookingStart ? bookingStart.toLocaleDateString() : "Unknown Date",
          startTime: bookingStart ? bookingStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Unknown",
          endTime: bookingEnd ? bookingEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Unknown",
          status: booking.booking_status || "Pending"
        });
      }

      // Convert map to array and sort by name
      const studentList = Array.from(studentMap.values())
        .sort((a, b) => a.name.localeCompare(b.name));

      setStudents(studentList);
    } catch (err) {
      console.error("Error fetching students with bookings:", err);
      setError("Failed to load student data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNavClick = (section: string) => {
    if (section === "home") {
      router.push("/dashboard");
    } else if (section === "booking") {
      router.push("/dashboard?tab=booking");
    } else if (section === "profile") {
      router.push("/dashboard?tab=profile");
    } else if (section === "history") {
      // Stay on this page
      return;
    }
  };

  const staffNav: NavItem[] = [
    { id: "home", label: "Home", icon: LuHouse },
    { id: "booking", label: "Booking", icon: LuCalendarPlus },
    { id: "history", label: "History", icon: LuUsers },
    { id: "profile", label: "Profile", icon: MdOutlinePerson },
  ];

  if (loading) {
    return (
      <div className="h-full bg-gray-50 flex flex-col overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading students...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-gray-50 flex flex-col overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-red-500">
            <p className="text-lg font-semibold">Error</p>
            <p>{error}</p>
            <button 
              onClick={() => fetchAllStudentsWithBookings()}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-xl"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 flex flex-col overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="w-full max-w-lg mx-auto px-4 pt-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">Students & Faculties</h1>
            <p className="mt-1 text-sm text-gray-600">
              View students and their booking history. ({students.length} students)
            </p>
          </div>

          <div className="mt-4 space-y-4 pb-4">
            {students.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                <LuUsers className="text-4xl mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No students with bookings found.</p>
              </div>
            ) : (
              students.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className="w-full text-left bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-base font-semibold text-gray-900">{s.name}</p>
                      <p className="text-sm text-gray-600">{s.faculty}</p>
                    </div>
                    <div className="text-sm font-semibold text-gray-700">
                      {s.bookings.length} bookings
                    </div>
                  </div>
                </button>
              ))
            )}

            {selected && (
              <div className="rounded-2xl bg-gray-100 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-base font-semibold text-gray-900">{selected.name}</p>
                    <p className="text-sm text-gray-600">{selected.faculty}</p>
                    <p className="text-xs text-gray-500">ID: {selected.matric}</p>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-sm text-blue-600 font-medium"
                  >
                    Close
                  </button>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-900">
                    Booking History ({selected.bookings.length})
                  </h3>
                  {selected.bookings.length === 0 ? (
                    <p className="text-sm text-gray-600">No bookings found.</p>
                  ) : (
                    selected.bookings.map((b) => (
                      <div key={b.id} className="bg-white rounded-xl border border-gray-200 p-3">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{b.resource}</p>
                            <p className="text-xs text-gray-600">{b.date} • {b.startTime} - {b.endTime}</p>
                          </div>
                          <div className={`text-sm font-semibold ${
                            b.status === 'Booked' || b.status === 'Completed' ? 'text-green-600' : 
                            b.status === 'Cancelled' || b.status === 'Rejected' ? 'text-red-500' : 
                            b.status === 'Pending' ? 'text-yellow-600' :
                            'text-gray-700'
                          }`}>
                            {b.status}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Navbar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[999] drop-shadow-2xl">
        <NavBar 
          items={staffNav} 
          activeSection="history" 
          onSectionChange={handleNavClick} 
        />
      </div>
    </div>
  );
}