import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to immersive mode as the default experience
  redirect("/immersive");
}
