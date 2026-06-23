import { ResourceSelectDepartment } from "./ResoourceSelectDepartment";
import React from "react";
import { ResourceDetails } from "./ResourceDetails";

interface ResourceUIProps{
    pageType: "list" | "detail";
    resourceId?: string;
}

export class ResourceUI extends React.Component<ResourceUIProps>{
    public static displayList(){
        return(
            <div className="w-screen flex flex-col items-center p-2">
                <ResourceSelectDepartment department="Central Learning Complex (CLC)"/>
            </div>
            
        );
    }

    public static viewResource(resourceID: string){
        return(
            <ResourceDetails resourceId={resourceID} />
        )
    }

    render() {

        const { pageType, resourceId } = this.props;

        return (
            <div>
                {pageType === "list" && ResourceUI.displayList()}
                {pageType === "detail" && resourceId !== undefined && ResourceUI.viewResource(resourceId)}
            </div>
        );
    }
}