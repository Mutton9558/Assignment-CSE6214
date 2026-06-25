"use server";

import { adminDb } from "@/lib/DatabaseInitializer";
import { MaintenanceRequest } from "@/types";

export async function getStudentReports(userId: string): Promise<MaintenanceRequest[]> {
    try {
        const snapshot = await adminDb.collection('MaintenanceRequests')
            .where('request_author', '==', userId)
            .get();

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                request_date: data.request_date.toDate() || new Date(),
                request_status: data.request_status || null,
            };
        }) as MaintenanceRequest[];
    } catch (error) {
        console.error("Error fetching student reports:", error);
        return [];
    }
}

export async function submitFaultReport(reportData: MaintenanceRequest) {
    try {
        await adminDb.collection("maintenanceRequests").doc(reportData.maintenance_id).set(reportData);
        return { success: true };
    } catch (error) {
        console.error("Error submitting fault report:", error);
        return { success: false };
    }
}