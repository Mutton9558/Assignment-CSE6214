"use client";

import { useRouter } from "next/navigation";
import { FaRegEdit, FaTrash } from "react-icons/fa";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface ResourceButtonProp{
    ResourceID: string;
    ResourceName: string;
    // change this to jwt later
    isResourceManager: boolean;
    // EditAction: () => void;
}

export function ResourceButton({ResourceID, ResourceName}: ResourceButtonProp){

    const router = useRouter();

    const { data: session, status } = useSession();
    const userRole = session?.user?.role?.toLowerCase() || null;
    const isResourceManager = userRole === "resource manager";

    if (status === "loading") {
        return <div className="w-72 h-16 bg-secondary/50 rounded-xl animate-pulse mt-1 mb-1" />;
    }
    
    const handleClick = () => {
        router.push(`/resource_details/${ResourceID}`)
    }

    return(
        <div onClick={handleClick} id="button-cont" className="relative w-72 h-16 bg-secondary rounded-xl p-4 cursor-pointer mt-1 mb-1">
            <h1 className="font-mono font-semibold text-xl">{ResourceName}</h1>
            { isResourceManager
            ? 
            <div className="absolute right-0 top-0 flex flex-col items-center justify-center w-1/5 h-full">
                <button onClick={(e) => {e.stopPropagation(); router.push(`/edit_resource/${ResourceID}`);}} className="cursor-pointer m-1"><FaRegEdit /></button>
                <button onClick={(e) => {e.stopPropagation(); router.push(`/delete_resource?id=${ResourceID}&name=${ResourceName}`);}} className="cursor-pointer m-1 mr-1.5"><FaTrash /></button>
            </div>
            : 
            null
            }
            
        </div>
    )
}