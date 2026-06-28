"use client";

import { AnalyticsUI } from "../components/AnalyticsUI";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Analytics(){
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
        <AnalyticsUI />
    )
}