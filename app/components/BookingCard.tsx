interface BookingCardProps {
    roomImage?: string;
    roomName: string;
    date: string;
    time: string;
    status: string;
}

export default function BookingCard({ roomImage, roomName, date, time, status }: BookingCardProps) {
    return (
            <div className="flex flex-col gap-1 w-full p-4 bg-white/50 bg-blur-md rounded-lg">
                <div className="flex flex-col gap-1 p-4">
                    {roomImage && (
                        <img src={roomImage} alt={roomName} className="w-full h-auto rounded-lg" />
                    )}
                    <h1 className="text-lg font-semibold">{roomName}</h1>
                    <p className="text-sm text-gray-600">Date: {date} | Time: {time}</p>
                    <p className="text-sm text-gray-600">Status: {status}</p>
                </div>
            </div>
    );
}