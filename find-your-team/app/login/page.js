import LoginButton from "@/components/LoginButton";

export default function LoginPage() {
  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-gray-400">Sign in using IITB SSO</p>

        <LoginButton />
      </div>
    </div>
  );
}