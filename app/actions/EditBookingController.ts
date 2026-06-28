// app/actions/EditBookingController.ts
"use server";

import { adminDb } from "@/lib/DatabaseInitializer";
import { Timestamp } from "firebase-admin/firestore";

interface EditBookingData {
  booking_id: string;
  user_id: string;
  resource_id: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  purpose: string;
  prev_booking: string;
}

export async function fetchBookingForEdit(bookingId: string) {
  try {
    const bookingRef = await adminDb.collection('Bookings').doc(bookingId).get();
    const bookingData = bookingRef.data();

    if (!bookingData) {
      return { error: "Booking not found" };
    }

    // Get owner details
    const ownerRef = await bookingData.booking_owner.get();
    const ownerData = ownerRef.data();

    // Get resource details
    const resourceRef = await bookingData.resource.get();
    const resourceData = resourceRef.data();

    // Format dates for input fields
    const startDate = bookingData.booking_start.toDate();
    const endDate = bookingData.booking_end.toDate();

    return {
      success: true,
      data: {
        booking_id: bookingId,
        user_id: ownerData.user_id || "",
        fullName: ownerData.name || "",
        phone: ownerData.contact_number || "",
        email: ownerData.email || "",
        startDate: startDate.toISOString().split('T')[0],
        startTime: startDate.toTimeString().slice(0, 5),
        endDate: endDate.toISOString().split('T')[0],
        endTime: endDate.toTimeString().slice(0, 5),
        purpose: bookingData.booking_reason || "",
        venue: resourceData.resource_dept || "",
        room: resourceData.resource_name || "",
        resource_id: resourceRef.id,
        equipments: resourceData.resource_equipments || [],
        prev_booking: bookingId,
      }
    };
  } catch (error) {
    console.error("Error fetching booking:", error);
    return { error: "Failed to load booking details" };
  }
}

export async function submitEditedBooking(data: EditBookingData) {
  try {
    const startDateTime = new Date(`${data.startDate}T${data.startTime}`);
    const endDateTime = new Date(`${data.endDate}T${data.endTime}`);

    // Get references
    const userRef = adminDb.collection('Users').doc(data.user_id);
    const resourceRef = adminDb.collection('Resources').doc(data.resource_id);
    
    // Create new booking document with edited details
    const newBookingRef = adminDb.collection('Bookings').doc();
    
    await newBookingRef.set({
      booking_owner: userRef,
      resource: resourceRef,
      booking_start: Timestamp.fromDate(startDateTime),
      booking_end: Timestamp.fromDate(endDateTime),
      booking_status: "Awaiting Approval",
      booking_reason: data.purpose,
      request_created_at: Timestamp.now(),
      prev_booking: adminDb.collection('Bookings').doc(data.prev_booking),
    });

    // Update original booking status to "Pending Re-approval"
    await adminDb.collection('Bookings').doc(data.prev_booking).update({
      booking_status: "Pending Re-approval"
    });

    return { success: true };
  } catch (error) {
    console.error("Error submitting edited booking:", error);
    return { error: "Failed to submit changes. Please try again." };
  }
}