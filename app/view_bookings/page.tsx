"use client";

import Button from "../components/Button"
import { BookingUI } from "../components/BookingUI";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ViewBookings(){
    const router = useRouter();
    const { data: session, status } = useSession();
    const userRole = session?.user?.role?.toLowerCase() || null;
    const isResourceManager = userRole === "resource manager";

    if(status === "loading"){
        return <div className="w-72 h-16 bg-secondary/50 rounded-xl animate-pulse mt-1 mb-1" />;
    }

    if(!isResourceManager){
        router.push('/');
    }

    return(
        <div className="p-4 h-full max-w-full mx-auto">
            <header className="flex justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold mb-4">Hi, {session?.user?.name || "user"}!</h1>
                    <p>Manage Pending Bookings</p>
                </div>
                
                <Button className="!w-10 !h-10 !p-2" buttonText="🔔" />
            </header>
            <BookingUI pageType="list" />
        </div>
    )
}