import Button from "./Button";
import BookingCard from "./BookingCard";
import Input from "./input";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProfileProps {
    setActiveSection: (section: string) => void;
}

export default function Profile({ setActiveSection }: ProfileProps) {
    const router = useRouter();
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
            </div>
        </div>
    );
}