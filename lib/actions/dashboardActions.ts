"use server";

import { adminDb } from "@/lib/DatabaseInitializer";
import { MaintenanceRequest, Booking } from "@/types";

export async function getDashboardSummary(user_id: string) {
    try{
        const reportsSnapshot = await adminDb.collection('MaintenanceRequests')
            .where('request_author', '==', user_id)
            .get();
        
            let openReportsCount = 0;
            let closedReportsCount = 0;

            reportsSnapshot.forEach((doc) => {
                const status = doc.data().request_status;
                if (status === "Resolved")
                    closedReportsCount++;
                else
                    openReportsCount++;
            });

            const now = new Date();
            const bookingsSnapshot = await adminDb.collection('Bookings')
                .where('booking_author', '==', user_id)
                .where('booking_end', '>=', now)
                .orderBy('booking_start', 'asc')
                .limit(5)
                .get();
            
            const upcomingEvents = bookingsSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    ...data,
                    booking_start: data.booking_start.toDate(),
                    booking_end: data.booking_end.toDate()
                };
            }) as Booking[];
        return { openReportsCount, closedReportsCount, upcomingEvents };
    } catch (error) {
        console.error("Error fetching dashboard summary:", error);
        return { openReportsCount: 0, closedReportsCount: 0, upcomingEvents: [] };
    }
}