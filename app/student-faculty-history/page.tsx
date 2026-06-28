"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NavBar, { NavItem } from "../components/NavBar";
import { LuHouse, LuCalendarPlus, LuUsers } from "react-icons/lu";
import { MdOutlinePerson } from "react-icons/md";

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

const mockStudents: Student[] = [
  {
    id: "s1",
    name: "Aisha Binti Khalid",
    faculty: "Faculty of Computing Informatics",
    matric: "251UC240AA",
    bookings: [
      { id: "b1", resource: "CLC - CNMX1004", date: "2026-05-29", startTime: "08:00", endTime: "10:00", status: "Completed" },
      { id: "b2", resource: "Library Room 2", date: "2026-06-05", startTime: "14:00", endTime: "16:00", status: "Cancelled" },
    ],
  },
  {
    id: "s2",
    name: "Muhammad Yusuf Bin Riduan",
    faculty: "Faculty of Computing Informatics",
    matric: "251UC240TK",
    bookings: [
      { id: "b3", resource: "CLC - CNMX1004", date: "2026-05-29", startTime: "08:00", endTime: "18:00", status: "Completed" },
      { id: "b4", resource: "Lab A", date: "2026-03-10", startTime: "09:00", endTime: "12:00", status: "Completed" },
    ],
  },
  {
    id: "s3",
    name: "Siti Nur",
    faculty: "Faculty of Computing Informatics",
    matric: "251UC240BB",
    bookings: [
      { id: "b5", resource: "Seminar Hall", date: "2026-04-20", startTime: "10:00", endTime: "12:00", status: "Completed" },
    ],
  },
];

export default function StudentFacultyHistoryPage() {
  const router = useRouter();
  const [students] = useState<Student[]>(mockStudents);
  const [selected, setSelected] = useState<Student | null>(null);

  const handleNavClick = (section: string) => {
    if (section === "home") {
      router.push("/dashboard");
    } else if (section === "booking") {
      router.push("/dashboard?tab=booking");
    } else if (section === "profile") {
      router.push("/dashboard?tab=profile");
    } else if (section === "history") {
      // Stay on this page - do nothing
      return;
    }
  };

  const staffNav: NavItem[] = [
    { id: "home", label: "Home", icon: LuHouse },
    { id: "booking", label: "Booking", icon: LuCalendarPlus },
    { id: "history", label: "History", icon: LuUsers },
    { id: "profile", label: "Profile", icon: MdOutlinePerson },
  ];

  return (
    <div className="h-full bg-gray-50 flex flex-col overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="w-full max-w-lg mx-auto px-4 pt-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">Students & Faculties</h1>
            <p className="mt-1 text-sm text-gray-600">View students and their booking history.</p>
          </div>

          <div className="mt-4 space-y-4 pb-4">
            {students.map((s) => (
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
                  <div className="text-sm font-semibold text-gray-700">{s.matric}</div>
                </div>
              </button>
            ))}

            {selected && (
              <div className="rounded-2xl bg-gray-100 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-base font-semibold text-gray-900">{selected.name}</p>
                    <p className="text-sm text-gray-600">{selected.faculty} • {selected.matric}</p>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-sm text-blue-600 font-medium"
                  >
                    Close
                  </button>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-900">Booking History</h3>
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
                            b.status === 'Completed' ? 'text-green-600' : 
                            b.status === 'Cancelled' ? 'text-red-500' : 
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

      {/* Fixed Bottom Navbar - Same as Staff Dashboard */}
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