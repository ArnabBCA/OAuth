"use client";
import { useAuth } from "@/lib/context/authContext";

export default function LoginPage() {
  const { login } = useAuth();

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4">
      <h1 className="text-md font-semibold">Login</h1>
      <div className="flex gap-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={login}
        >
          Login
        </button>
      </div>
    </div>
  );
}
