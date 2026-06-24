import Button from "../Button";
import BookingCard from "../BookingCard";
import ReportCard from "../ReportCard";
import Input from "../input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MaintenanceRequest } from "@/types";


interface ProfileProps {
    setActiveSection: (section: string) => void;
    initialTab?: "bookings" | "reports"
}

export default function Profile({ setActiveSection, initialTab = "bookings" }: ProfileProps) {
    const router = useRouter();
    const [currentTab, setCurrentTab] = useState<"bookings" | "reports">(initialTab);
    const mockReports = [
        {
            maintenance_id: "M001",
            faulty_resource: "Room 101",
            fault_detail: "Leaking faucet",
            request_status: "Pending",
            request_date: new Date("2024-07-01"),
            request_author: "John Doe",
            proof_url:"",
            schedule_service_date: new Date("2024-07-03")
        },
        {
            maintenance_id: "M002",
            faulty_resource: "Room 202",
            fault_detail: "Broken window",
            request_status: "In Progress",
            request_date: new Date("2024-07-02"),
            request_author: "John Doe",
            proof_url: "",
            schedule_service_date: new Date("2024-07-04")
        },
        {
            maintenance_id: "M003",
            faulty_resource: "Room 303",
            fault_detail: "Air conditioning not working",
            request_status: "Resolved",
            request_date: new Date("2024-07-03"),
            request_author: "John Doe",
            proof_url: "",
            schedule_service_date: new Date("2024-07-05")
        },
    ] as MaintenanceRequest[];

    useEffect(() => {
        setCurrentTab(initialTab);
    }, [initialTab])
    return(
        <div className="p-6 h-full w-full max-w-lg mx-auto">
            <header className="flex justify-between items-center mb-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold">John</h1>
                    <p className="text-sm">john@student.apu.edu.my</p>
                </div>
                <div className="flex flex-row gap-3">
                    <Button className="!h-10" buttonText="Edit Profile" onClick={() => setActiveSection("edit-profile")} />
                    <Button className="!w-10 !h-10" buttonText="🚪" onClick={() => router.push('/login')} />
                </div>
            </header>
            <div className="flex flex-col gap-4 w-full">
                <div className="bg-background/20 z-50 backdrop-blur-md p-4 rounded-3xl shadow-md">
                    <h2 className="text-xl font-bold mb-4">Personal Information</h2>
                    <div className="flex flex-col gap-1 w-full">
                        <h1>Full name: John Doe</h1>
                        <h1>Student ID: S123456</h1>
                        <h1>Email: john@student.apu.edu.my</h1>
                        <h1>Phone Number: 123-456-7890</h1>
                    </div>
                </div>
                <div className="w-full h-1 bg-gray-300 rounded-full" />
                <div className="flex bg-white/40 p-1 rounded-xl backdrop-blur-md shadow-sm">
                    <button
                        onClick={() => setCurrentTab("bookings")}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-300 hover:cursor-pointer ${
                            currentTab === "bookings" 
                            ? "bg-white shadow-md text-blue-600" 
                            : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                        }`}
                    >
                        My Bookings
                    </button>
                    <button
                        onClick={() => setCurrentTab("reports")}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-300 hover:cursor-pointer ${
                            currentTab === "reports" 
                            ? "bg-white shadow-md text-blue-600" 
                            : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                        }`}
                    >
                        My Reports
                    </button>
                </div>

                {currentTab === "bookings" ? (
                <>
                    <div className="bg-background/20 z-50 backdrop-blur-md p-4 rounded-3xl shadow-md">
                        <h2 className="text-xl font-bold mb-4">Upcoming Bookings</h2>
                        <div className="flex flex-col gap-1 w-full">
                            <BookingCard 
                                roomImage="/path/to/room-image.jpg"
                                roomName="Room 202"
                                date="2024-07-05"
                                time="2:00 PM - 4:00 PM"
                                status="Approved"
                            />
                        </div>
                    </div>
                    <div className="bg-background/20 z-50 backdrop-blur-md p-4 rounded-3xl shadow-md">
                        <h2 className="text-xl font-bold mb-4">Past Bookings</h2>
                        <div className="flex flex-col gap-1 w-full">
                            <BookingCard 
                                roomImage="/path/to/room-image.jpg"
                                roomName="Room 202"
                                date="2024-07-05"
                                time="2:00 PM - 4:00 PM"
                                status="Approved"
                            />
                        </div>
                    </div>
                </>
                ) : (
                    <>
                        {mockReports.length === 0 ? (
                            <>
                                <h2 className="text-xl font-bold mb-4">My Reports</h2>
                                <p className="text-gray-600">You have no reports yet.</p>
                            </>
                        ) : (
                            <>
                                <div className="flex flex-col gap-3 w-full">
                                    {mockReports.map((report) => (
                                        <ReportCard key={report.maintenance_id} request={report} />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}