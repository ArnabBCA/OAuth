"use client";

import { useAuth } from "@/lib/context/authContext";
import Link from "next/link";
import Image from "next/image";

const HomePage = () => {
  const { loading, logout, user, useServerSide } = useAuth();

  return (
    <div className="flex flex-col items-center w-full h-screen justify-center gap-4">
      <h1>
        {useServerSide ? "Using Server Side Auth" : "Usiing Client Side Auth"}
      </h1>
      <h1 className="text-md font-semibold">Home Page</h1>
      <Link href="/dashboard">Dashboard</Link>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        onClick={logout}
      >
        Logout
      </button>
      {loading ? (
        <div>Loading....</div>
      ) : (
        user && (
          <div className="rounded-lg border bg-card shadow-sm p-4">
            <h1>User Info</h1>
            <Image
              src={user.picture}
              alt="User Image"
              width={100}
              height={100}
              className="rounded-full"
            />
            <div className="w-full">
              {Object.keys(user).map((key) => (
                <div key={key}>
                  <span>{key + ": " + user[key]}</span>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default HomePage;
