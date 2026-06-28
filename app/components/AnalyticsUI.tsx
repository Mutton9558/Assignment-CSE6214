"use client";

import React from "react";
import Button from "./Button";
import { useState, useEffect } from "react";
import { generateBookingAnalytics } from "../actions/AnalyticsController";
import { AnalyticsData } from "@/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const DashboardComponent: React.FC = () => {

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
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData>();

    useEffect(() => {
        async function getData(){
            const data = await generateBookingAnalytics();
            if(data){
                setAnalyticsData(data);
            }
        }
        
        getData();
    }, [])

    return(
        <div className="max-w-full min-h-screen">
            <header className="flex justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold mb-4">Hi, {session?.user.name || "user"}!</h1>
                    <p>Analytics (18th - 24th May 2026)</p>
                </div>
                
                <Button className="!w-10 !h-10 !p-2" buttonText="🔔" />
            </header>
            <div id="content-section" className="mt-4 w-full">
                <div id="booking-section-header" className="flex flex-row justify-between items-center">
                    <h1 className="font-semibold text-sm">Total number of Bookings</h1>
                    <h1 className="font-semibold text-sm flex flex-row justify-center items-center">{analyticsData?.bookingCount} total</h1>
                </div>
                <div id="top-bookings" className="w-full p-2 min-h-32 bg-secondary mt-4 rounded-2xl flex flex-col">
                    <h1 className="font-semibold">Top Booked Venues</h1>
                    {analyticsData?.bookingTopResources.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No bookings this week.</p>
                    ) : (
                        analyticsData?.bookingTopResources.map((item, index) => (
                            <div key={item.resourceId} className="grid grid-cols-[65%_1fr] gap-4">
                                <p>#{index + 1} {item.name}</p>
                                <p className="place-self-end text-sm">{item.count} booking{item.count > 1 ? 's' : ''}</p>
                            </div>
                        ))
                    )}
                </div>
                <div className="p-2 w-full min-h-12 bg-secondary mt-4 rounded-full flex flex-row justify-between items-center">
                    <h1 className="font-semibold">Peak Booking Hours</h1>
                    <p className="text-sm">{analyticsData?.peakBookingHours}:00</p>
                </div>
                <div className="w-full h-0.5 bg-black mt-8 mb-8"></div>
                <div id="booking-section-header" className="flex flex-row justify-between items-center">
                    <h1 className="font-semibold text-sm">Total number of Reports</h1>
                    <h1 className="font-semibold text-sm flex flex-row justify-center items-center">{analyticsData?.reportCount} total</h1>
                </div>
                <div id="top-bookings" className="w-full p-2 min-h-32 bg-secondary mt-4 rounded-2xl flex flex-col">
                    <h1 className="font-semibold">Top Reported Venues</h1>
                    {analyticsData?.reportTopResources.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No reports this week.</p>
                    ) : (
                        analyticsData?.reportTopResources.map((item, index) => (
                            <div key={item.resourceId} className="grid grid-cols-[65%_1fr] gap-4">
                                <p>#{index + 1} {item.name}</p>
                                <p className="place-self-end text-sm">{item.count} report{item.count > 1 ? 's' : ''}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <div className="h-32 mt-2"></div>
        </div>
    )
}

export class AnalyticsUI extends React.Component{
    public static displayAnalyticsDashboard(){
        return(
            <div className="p-4 h-full max-w-screen mx-auto">
                <DashboardComponent />
            </div>
        )
    }

    render(){
       return(
        <div>
            {AnalyticsUI.displayAnalyticsDashboard()}
        </div>
       ) 
    }
}