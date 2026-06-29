import { ResourceSelectDepartment } from "./ResourceSelectDepartment";
import React from "react";
import { ResourceDetails } from "./ResourceDetails";
import { EditResourceDetails } from "./EditResourceDetails";
import { DEPARTMENTS } from "../constants";

interface ResourceUIProps{
    pageType: "list" | "detail" | "edit" | "add";
    resourceId?: string;
    department?: string;
}

export class ResourceUI extends React.Component<ResourceUIProps>{
    
    public static displayList(){
        return(
            <div>
                {
                    [...DEPARTMENTS.entries()].map(([key, val]) => (
                        <ResourceSelectDepartment key={key} department={key} />
                    ))
                }
                <div className="h-32 mt-2"></div>
            </div>
            
        );
    }

    public static viewResource(resourceID: string){
        return(
            <ResourceDetails resourceId={resourceID} />
        )
    }
    
    public static modifyResourceForm(resourceID?: string, department?: string){
        return(
            <EditResourceDetails resourceId={resourceID} department={department} />
        )
    }

    render() {

        const { pageType, resourceId, department } = this.props;

        return (
            <div>
                {pageType === "list" && ResourceUI.displayList()}
                {pageType === "detail" && resourceId !== undefined && ResourceUI.viewResource(resourceId)}
                {pageType === "edit" && resourceId !== undefined && ResourceUI.modifyResourceForm(resourceId)}
                {pageType === "add" && ResourceUI.modifyResourceForm(undefined, department)}
            </div>
        );
    }
}