import getGoogleOAuthURL from "@/utils/getGoogleUrl";

export default function Home() {
  return (
    <div className="w-full h-full">
      <h1>Home</h1>
      <a href={getGoogleOAuthURL()}>Login</a>
    </div>
  );
}
