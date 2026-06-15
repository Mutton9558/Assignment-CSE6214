import Input from "../components/input";

export default function forgotPassword() {

    return (
        <div className="flex h-screen items-center justify-center bg-radial-[at_0%_100%] from-blue-500 to-gray-200 bg-[length:200%_200%] animate-gradient">
            <div className="flex flex-col justify-center h-100% min-w-[60%] max-w-md p-6 bg-white/45 rounded-lg backdrop-blur-sm">
                <h1 className="text-2xl font-bold">Forgot Password</h1>
                <p className="text-sm text-gray-600">Let's get you logged back in!</p>
                <form className="mt-6 flex flex-col gap-8">
                    <Input label="Email" type="text" placeholder="Email" required />
                    <button type="submit" className="flex items-center justify-center gap-3 bg-blue-500 text-white py-3 rounded-md cursor-pointer hover:bg-blue-600 transition-colors">
                        <span>→</span>
                        <span>Reset Password</span>
                    </button>
                    <div className="text-sm text-gray-600">
                        <p>Remember your password?{" "}
                            <a href="/login" className="text-blue-500 hover:underline">Login</a>
                        </p>
                    </div>
                </form>

            </div>
        </div>
    )
}