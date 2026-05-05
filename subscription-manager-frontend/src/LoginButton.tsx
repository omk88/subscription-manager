import { authClient } from "./auth-client"; 

const handleGoogleLogin = async () => {
    await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
    });
};

export default function Login() {
    return <button onClick={handleGoogleLogin}>Sign in with Google</button>;
}