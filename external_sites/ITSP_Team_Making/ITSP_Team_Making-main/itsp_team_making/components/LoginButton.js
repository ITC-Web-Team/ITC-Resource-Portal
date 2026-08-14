"use client";

const NEXT_PUBLIC_PROJECT_ID  = process.env.NEXT_PUBLIC_PROJECT_ID ;

export default function LoginButton() {
  const handleLogin = () => {
    window.location.href = 
      "https://sso.tech-iitb.org/project/6f88d04e-58cc-44ff-a827-083b78c7d854/ssocall/"
;
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-blue-600 px-6 py-3 rounded-xl hover:bg-blue-700"
    >
      Login with SSO
    </button>
  );
}