"use client";

import React from "react";
import { BookingRequestList } from "./BookingRequestList";

interface BookingListUIProps{
    pageType: "list" | "detail" | "edit";
    bookingId?: string;
}

export class BookingListUI extends React.Component<BookingListUIProps>{
    public static displayList(){
        return (
            <div className="p-4 h-full max-w-screen mx-auto">
                <BookingRequestList />
            </div>
        );
    }

    render() {

        const { pageType, bookingId } = this.props;

        return (
            <div>
                {pageType === "list" && BookingListUI.displayList()}
            </div>
        );
    }
}