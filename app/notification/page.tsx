"use client";
import { Notification } from "@/types";
import { useState, useEffect } from "react";
import { useRouter } from"next/navigation";
import { useSession } from "next-auth/react";
import { fetchNotifications, markAsRead } from "@/app/actions/NotificationController";
import BackButton from "../components/BackButton";
import Button from "../components/Button";

interface NotificationsProps {
    setActiveSection: (section: string) => void;
}

export default function NotificationPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [notification, setNotification] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchNotificationsData() {
            const userId = String((session?.user as any)?.user_id || session?.user?.id);
            if (userId) {
                const notificationsData = await fetchNotifications(userId);
                setNotification(notificationsData);
            }
            setIsLoading(false);
        }

        if (session)
            fetchNotificationsData();
    }, [session]);

    const handleMarkAsRead = (id: string, isRead: boolean) => {
        if (isRead) return;
        
        setNotification(prev => prev.map(n => n.notification_id === id ? { ...n, isRead: true } : n));
    };

    return (
        <div className="p-6 h-full w-full max-w-lg mx-auto">
            <header className="flex justify-between mb-6">
                <BackButton buttonName="Return to Dashboard" buttonDesc={notification.length === 0 ? "No notifications to display" : `You have ${notification.length} notifications`} />
                <Button className="!w-fit !h-10 !p-4 !absolute right-5 top-4" buttonText="Mark All as Read" onClick={() => {
                    // Implement the logic to mark all notifications as read
                    console.log("Marking all notifications as read");
                }} />
            </header>

            <div className="relative top-5 flex flex-col gap-4 w-full">
                {notification.length === 0 ? (
                    <div className="bg-background/20 backdrop-blur-md p-8 rounded-3xl shadow-md text-center">
                        <span className="text-4xl mb-4 block">📭</span>
                        <h2 className="text-xl font-bold text-gray-800">All caught up!</h2>
                        <p className="text-sm text-gray-600 mt-2">You have no new notifications.</p>
                    </div>
                ) : (
                    notification.map((notif) =>(
                        <div
                            key={notif.notification_id}
                            className={`flex flex-col gap-2 p-4 backdrop-blur-md rounded-2xl shadow-sm border transition-all duration-300 ${
                                notif.isRead
                                ? "bg-white/40 border-white/20"
                                : "bg-white/80 borer-blue-200 shadow-md"
                            }`}
                        >
                            <div className="flex justify-between items-center w-full">
                                <div className="flex items-center gap-3">
                                    {!notif.isRead && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shrink-0" />}
                                    <h3 className={`font-bold ${notif.isRead ? "text-gray-600" : "text-gray-900"}`}>
                                        {notif.title}
                                    </h3>
                                </div>
                                <span className="text-xs font-medium text-gray-500 shrink-0">{notif.timestamp.toLocaleDateString()}</span>
                            </div>
                            <div className="mt-2 pt-3 border-t border-gray-200/50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <p className="text-sm text-gray-700 leading-relaxed mb-4">
                                        {notif.message}
                                    </p>
                                    <div className="flex justify-end gap-2">
                                        {!notif.isRead && (
                                            <Button 
                                                className="!h-8 !px-4 !text-xs !bg-blue-600 !text-white" 
                                                buttonText="Mark as Read" 
                                                onClick={(e) => handleMarkAsRead(notif.notification_id, true)} 
                                            />
                                        )}
                                        {notif.type === "report" && (
                                            <Button 
                                                className="!h-8 !px-4 !text-xs !bg-gray-200 !text-black" 
                                                buttonText="View Report" 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push("/dashboard?tab=reports");
                                                }} 
                                            />
                                        )}
                                    </div>
                                </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}