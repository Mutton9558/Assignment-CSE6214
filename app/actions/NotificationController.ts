"use server";

import { adminDb } from "@/lib/DatabaseInitializer";
import { cleanFirestoreData } from "@/lib/utils";

export async function fetchNotifications(userId: string) {
    try {
        const snapshot = await adminDb.collection("Notifications")
            .where("user_id", "==", userId)
            .orderBy("created_at", "desc")
            .get();
        
        return snapshot.docs.map(doc => ({
            notification_id: doc.id,
            ...cleanFirestoreData(doc.data())
        }));
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }
}

export async function createNotification(targetUserId: string, title: string, message: string) {
    try {
        await adminDb.collection("Notifications").add({
            targetUser: targetUserId,
            title: title,
            message: message,
            isRead: false,
            timestamp: new Date()
        });
        return { success: true };
    } catch (error) {
        console.error("Error creating notification:", error);
        return { success: false };
    }
}

export async function markAsRead(notification_id: string) {
    try {
        await adminDb.collection("Notifications").doc(notification_id).update({
            read: true
        });
        return { success: true };
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return { success: false };
    }
}