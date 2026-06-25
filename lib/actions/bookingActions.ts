"use server";

import { auth } from "@/auth";
import { adminDb } from "@/lib/DatabaseInitializer";
import { Booking } from "@/types";

export async function getStudentBookings(userId: string): Promise<Booking[]> {
    try {
        const snapshot = await adminDb.collection('Bookings')
            .where('booking_author', '==', userId)
            .get();

        return snapshot.docs.map(doc => ({
            ...doc.data(),
            booking_start: doc.data().booking_start.toDate(),
            booking_end: doc.data().booking_end.toDate()
        })) as Booking[];
    } catch (error) {
        console.error("Error fetching student bookings:", error);
        return [];
    }
}

export async function createBooking(bookingData: Booking) {
    try {
        const session = await auth();
        
        if (!session || !session.user) {
            throw new Error("User not authenticated");
        }

        if (bookingData.booking_end <= bookingData.booking_start) {
            throw new Error("Booking end time must be after start time");
        }

        await adminDb.collection("bookings").add({
            ...bookingData,
            booking_author: session.user.id,
        });
        return { success: true, message: "Booking created successfully" };
    } catch (error) {
        console.error("Error creating booking:", error);
        return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
    }
}