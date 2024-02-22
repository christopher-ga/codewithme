import { useSignUp } from "@clerk/clerk-react";
import { useState } from "react";

export default function SignUp() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const { isLoaded, signUp, setActive } = useSignUp();

    if (!isLoaded) {
        // handle loading state
        return null;
    }

    async function submit(e) {
        e.preventDefault();
        // Check the sign up response to
        // decide what to do next.
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
        <form onSubmit={submit}>
            <div>
                <label htmlFor="username">username</label>
                <input
                    type="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div>
                <button>Sign up</button>
            </div>
        </form>
    );
}