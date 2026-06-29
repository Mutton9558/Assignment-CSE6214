"use client";

import { useState, useEffect } from "react";
import NavBar, { NavItem } from "../NavBar";
import { LuHouse, LuCalendarPlus, LuUsers } from "react-icons/lu";
import { MdOutlinePerson } from "react-icons/md";
import { useSearchParams, useRouter } from "next/navigation";
import HomeDashboard from "../HomeDashboard";
import PreBooking from "../preBookingStaff";
import VenueBooking from "../VenueBooking";
import Profile from "../UserBoundary/Profile";
import EditProfile from "../UserBoundary/EditProfile";
import { UserProvider } from "../UserBoundary/UserContext";
// Don't import the page - we'll use router to navigate

interface StaffDashboardProp {
    default_sect: string | null
}

interface BookingData {
    userId: string;
    fullName: string;
    email: string;
    bookingStart: Date;
    bookingEnd: Date;
    bookingPurpose: string;
}

export default function Staff({ default_sect }: StaffDashboardProp) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams.get("tab");

    const getStartingSection = () => {
        if (tabParam === "reports") return "profile-reports";
        if (tabParam === "bookings") return "profile";
        if (tabParam === "history") return "history";
        return default_sect || "home";
    };

    const [activeSection, setActiveSection] = useState(getStartingSection());
    const [bookingData, setBookingData] = useState<BookingData | null>(null);

    useEffect(() => {
        if (tabParam === "reports") setActiveSection("profile-reports");
        if (tabParam === "bookings") setActiveSection("profile");
        if (tabParam === "history") {
            // Navigate to the student-faculty-history page
            router.push("/student-faculty-history");
            return;
        }
    }, [tabParam]);

    const handleNavClick = (newSection: string) => {
        // If clicking History, navigate to the page
        if (newSection === "history") {
            router.push("/student-faculty-history");
            return;
        }
        
        setActiveSection(newSection);
        
        if (searchParams.get("tab")) {
            router.replace("/dashboard", { scroll: false }); 
        }
    };

    const staffNav: NavItem[] = [
        { id: "home", label: "Home", icon: LuHouse },
        { id: "booking", label: "Booking", icon: LuCalendarPlus },
        { id: "history", label: "History", icon: LuUsers },
        { id: "profile", label: "Profile", icon: MdOutlinePerson },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case "home":
                return <HomeDashboard setActiveSection={setActiveSection} />;
            case "booking":
                return <PreBooking setActiveSection={setActiveSection} setBookingData={setBookingData} />;
            case "venue-booking":
                return <VenueBooking setActiveSection={setActiveSection} bookingData={bookingData} />;
            case "profile":
                return <Profile setActiveSection={setActiveSection} initialTab="bookings" />;
            case "edit-profile":
                return <EditProfile setActiveSection={setActiveSection} />;
            case "profile-reports":
                return <Profile setActiveSection={setActiveSection} initialTab="reports" />
            default:
                return <div>Section not found</div>;
        }
    };

    return (
        <UserProvider>
            <div className="h-full bg-gray-50 flex flex-col overflow-hidden">
                <main className="flex-1 flex justify-center overflow-y-auto pb-32">
                    {renderContent()}
                </main>
                <div className="h-2"></div>
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[999] drop-shadow-2xl">
                    <NavBar 
                        items={staffNav} 
                        activeSection={activeSection.startsWith("profile") ? "profile" : activeSection} 
                        onSectionChange={handleNavClick} 
                    />
                </div>
            </div>
        </UserProvider>
    );
}