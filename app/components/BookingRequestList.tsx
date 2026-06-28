import { FilterButtons } from "./FilterButtons";
import { useState, useEffect } from "react";
import BookingCard from "./BookingCard";
import BookingRequestCard from "./BookingRequestCard";
import { fetchAllBooking } from "../actions/BookingController";
import { Booking } from "@/types";
import Button from "./Button";
import { useRouter } from "next/navigation";

export function BookingRequestList(){

    const [selectedDept, setSelectedDept] = useState("All");
    const [loading, setLoading] = useState(true);
    const [bookingList, setBookingList] = useState<Booking[] | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function getBookingList(){
            try {
                const bookings = await fetchAllBooking();
                const pending = bookings.filter(booking => booking.booking_status === "Awaiting Approval");
                setBookingList(pending);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        getBookingList();
    }, [])

    return(
        <div className="max-w-full min-h-screen">
            <header className="flex justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold mb-4">Hi, John!</h1>
                    <p>Manage Pending Bookings</p>
                </div>
                
                <Button className="!w-10 !h-10 !p-2" buttonText="🔔" />
            </header>
            <div className="w-full flex flex-row justify-end">
                <h1>View All Bookings?</h1>
                <button onClick={() => router.push('/view_bookings')}>Click me</button>
            </div>
            <FilterButtons onClickHandler={setSelectedDept}/>
            {
                loading ?
                <div className="w-full flex justify-center items-center">
                    <p>Loading</p>
                </div>
                :
                <div className="flex flex-col gap-3 w-full mt-4 justify-center">
                    {(() => {
                        // filter the list based on status and department first
                        const filteredBookings = (bookingList || []).filter(booking => {
                            const matchesStatus = booking.booking_status === "Awaiting Approval";
                            const matchesDept = selectedDept === "All" || selectedDept === booking.resource.resource_dept;
                            return matchesStatus && matchesDept;
                        });

                        // render based on whether the filtered list has items
                        return filteredBookings.length > 0 ? (
                            filteredBookings.map((booking: Booking, index) => (
                                <BookingRequestCard 
                                    key={booking.booking_id || index}
                                    booking_id={booking.booking_id} 
                                    booking_status={booking.booking_status} 
                                    booking_start={booking.booking_start}
                                    booking_end={booking.booking_end}
                                    userName={booking.booking_owner.name} 
                                    userRole={booking.booking_owner.role} 
                                    resource_id={booking.resource.resource_id}
                                    resourceDepartment={booking.resource.resource_dept} 
                                    resourceName={booking.resource.resource_name} 
                                    userEmail={booking.booking_owner.email}
                                />
                            ))
                        ) : (
                            <div className="w-full flex justify-center items-center py-12 text-gray-500 font-medium">
                                <p>No Bookings</p>
                            </div>
                        );
                    })()}
                </div>
            }
        </div>
    )
}