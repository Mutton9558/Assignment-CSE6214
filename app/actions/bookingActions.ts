"use server";

import { adminDb } from "@/lib/DatabaseInitializer";
import { Booking } from "@/types";
import { Timestamp } from "firebase-admin/firestore";
import { cleanFirestoreData } from "@/lib/utils";

export async function getStudentBookings(userId: string): Promise<Booking[]> {
    try {
        const snapshot = await adminDb.collection('Bookings')
            .where('booking_author', '==', userId)
            .get();

        return snapshot.docs.map(doc => ({
            booking_id: doc.id,
            ...cleanFirestoreData(doc.data()),
        })) as Booking[];
    } catch (error) {
        console.error("Error fetching student bookings:", error);
        return [];
    }
}

export async function createBooking(bookingData: Booking) {
    try {
        if (bookingData.booking_end <= bookingData.booking_start) {
            throw new Error("Booking end time must be after start time");
        }

        await adminDb.collection("bookings").add({
            ...bookingData,
            booking_author: bookingData.booking_author,
        });
        return { success: true, message: "Booking created successfully" };
    } catch (error) {
        console.error("Error creating booking:", error);
        return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
    }
}