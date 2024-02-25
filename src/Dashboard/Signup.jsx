import { useSignUp } from "@clerk/clerk-react";
import { useState } from "react";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const { isLoaded, signUp, setActive } = useSignUp();

    if (!isLoaded) {
        // handle loading state
        return null;
    }

    async function submit(e) {
        e.preventDefault();
        await signUp
            .create({
                username,
                password,
            })
            .then((result) => {
                if (result.status === "complete") {
                    console.log(result);
                    setActive({ session: result.createdSessionId });
                } else {
                    console.log(result);
                }
            })
            .catch((err) => console.error("error", err.errors[0].longMessage));
    }
    return (
        <main className="w-full h-screen flex flex-col items-center justify-center px-4">
            <div className="max-w-sm w-full text-gray-600">
                <div className="text-center">
                    <img src="/codewithmelogo.png" width={150} className="mx-auto" />
                    <div className="mt-5 space-y-2">
                        <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Create an account</h3>
                        <p className="">Have an account? <a href="/signin" className="font-medium text-indigo-600 hover:text-indigo-500">Sign in</a></p>
                    </div>
                </div>
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="mt-8 space-y-5"
                >
                    <div>
                        <label className="font-medium">
                            Username
                        </label>
                        <input
                            type="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="font-medium">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                        />
                    </div>
                    <button
                        onClick={submit}
                        className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
                    >
                        Create account
                    </button>

                </form>
            </div>
        </main>
    )
}