"use server";

import { adminDb } from "@/lib/DatabaseInitializer";
import { User } from "@/types";
import { cleanFirestoreData } from "@/lib/utils";
import bcrypt from "bcrypt";

export async function getAllUsers() {
    try {
        const snapshot = await adminDb.collection("Users").get();
        return snapshot.docs.map(doc => ({
            user_id: doc.id,
            ...cleanFirestoreData(doc.data())
        })) as User[];
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

export async function getUserById(user_id: string) {
    try {
        const doc = await adminDb.collection("Users").doc(user_id).get();
        if (!doc.exists) return null;
        return { user_id: doc.id, ...cleanFirestoreData(doc.data()) } as User;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}

export async function updateUser(user_id: string, data: Partial<User>) {
    try {
        await adminDb.collection("Users").doc(user_id).update(data);
        return { success: true };
    } catch (error) {
        console.error("Error updating user:", error);
        return { success: false, message: "Failed to update user" };
    }
}

export async function updateUserPassword(user_id: string, newPassword: string) {
    try {
        const hashed = await bcrypt.hash(newPassword, 10);
        await adminDb.collection("Users").doc(user_id).update({ password: hashed });
        return { success: true };
    } catch (error) {
        console.error("Error updating password:", error);
        return { success: false };
    }
}

export async function deleteUser(user_id: string) {
    try {
        await adminDb.collection("Users").doc(user_id).delete();
        return { success: true };
    } catch (error) {
        console.error("Error deleting user:", error);
        return { success: false, message: "Failed to delete user" };
    }
}

export async function registerStaff(staffData: {
    user_id: string;
    name: string;
    email: string;
    password: string;
    contact_number: string;
    department: string;
    role: "Campus Staff" | "Resource Manager" | "Admin";
}) {
    try {
        const existing = await adminDb.collection("Users").doc(staffData.user_id).get();
        if (existing.exists) return { success: false, message: "User ID already registered" };

        const emailCheck = await adminDb.collection("Users").where("email", "==", staffData.email).get();
        if (!emailCheck.empty) return { success: false, message: "Email already registered" };

        const hashed = await bcrypt.hash(staffData.password, 10);
        const newUser: User = {
            ...staffData,
            password: hashed,
            account_status: "Active",
            two_factor_enabled: false
        };

        await adminDb.collection("Users").doc(staffData.user_id).set(newUser);
        return { success: true };
    } catch (error) {
        console.error("Error registering staff:", error);
        return { success: false, message: "Failed to register staff" };
    }
}

export async function getAllFeedbacks() {
    try {
        const snapshot = await adminDb.collection("Feedbacks").orderBy("timestamp", "desc").get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...cleanFirestoreData(doc.data()) }));
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        return [];
    }
}
