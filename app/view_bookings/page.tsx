"use client";

import BackButton from "../components/BackButton";
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
            <BackButton buttonName="Back" buttonDesc={`List of Bookings`} />
            <BookingUI pageType="list" />
        </div>
    )
}