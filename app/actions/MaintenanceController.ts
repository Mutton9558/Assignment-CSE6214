"use server";

import { adminDb } from "@/lib/DatabaseInitializer";
import { DocumentReference } from "firebase-admin/firestore";
import { MaintenanceRequest } from "@/types";

export async function fetchAllRequests(){
    try{
        const maintenanceRef = await adminDb.collection('MaintenanceRequests').get();
        const maintenanceRequestList: MaintenanceRequest[] = [];
        for(const doc of maintenanceRef.docs) {
            const data = doc.data();
            if(data){
                async function getUser(user: DocumentReference){
                    const author = await user.get();
                    return author.data();    
                }

                async function getResource(resource: DocumentReference){
                    const res = await resource.get();
                    return res.data();
                }
                
                const [author, resource] = await Promise.all([
                    getUser(data.request_author),
                    getResource(data.faulty_resource)
                ]);
            
                if(author && resource){
                    maintenanceRequestList.push({
                        fault_id: doc.id,
                        request_author: author.name,
                        faulty_resource_name: resource.resource_name,
                        faulty_resource_dept: resource.resource_dept,
                        fault_detail: data.fault_detail,
                        proof_url: data.proof_url,
                        status: data.status,
                        request_date: data.request_date.toDate(),
                        scheduledServiceDate: data.scheduledServiceDate.toDate()
                    })
                } else {
                    continue;
                }
            } else {
                return [];
            }
        };
        return maintenanceRequestList;
    } catch (error) {
        console.log(error);
        return [];
    }
}