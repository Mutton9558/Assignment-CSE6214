"use client";

import React from "react";
import Button from "./Button";
import { MaintenanceRequestList } from "./MaintenanceRequestList";

interface MaintenanceUIProps{
    pageType: "list" | "detail" | "edit";
    MaintenanceId?: string;
}

export class MaintenanceUI extends React.Component<MaintenanceUIProps>{
    public static displayList(){

        

        return(
            <div className="p-6 h-full w-full max-w-lg mx-auto">
                <header className="flex justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Hi, John!</h1>
                        <p>Maintenance Request List</p>
                    </div>
                    
                    <Button className="!w-10 !h-10 !p-2" buttonText="🔔" />
                </header>
                <MaintenanceRequestList />
            </div>                
        );
    }

    render() {

        const { pageType, MaintenanceId } = this.props;

        return (
            <div>
                {pageType === "list" && MaintenanceUI.displayList()}
            </div>
        );
    }
}