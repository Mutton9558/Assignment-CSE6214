"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/app/components/UserBoundary/UserContext";
import Button from "../Button";

const GOOGLE_FORM_LINK = "YOUR_GOOGLE_FORM_LINK_HERE";

export default function Feedbacks() {
    const router = useRouter();
    const { user: adminUser, isLoading } = useUser();

    function getGreeting() {
        const h = new Date().getHours();
        if (h < 12) return "Good Morning";
        if (h < 18) return "Good Afternoon";
        return "Good Evening";
    }

    return (
        <div className="p-6 h-full w-full max-w-lg mx-auto flex flex-col gap-4">
            <header className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold">
                        {isLoading ? "Loading..." : `${getGreeting()}, ${adminUser?.name?.split(" ")[0] || "Admin"}!`}
                    </h1>
                    <p className="text-sm text-gray-600">Feedbacks</p>
                </div>
                <Button buttonText="🚪" className="!w-10 !h-10" onClick={() => router.push("/login")} />
            </header>

            <div className="flex flex-col items-center justify-center mt-10 gap-4">
                <p className="text-gray-500 text-sm">Feedbacks are collected via Google Forms.</p>
                <a href={GOOGLE_FORM_LINK} target="_blank" rel="noreferrer" className="text-blue-500 underline text-sm">
                    View Feedbacks
                </a>
            </div>
        </div>
    );
}
