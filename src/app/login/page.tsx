import { Suspense } from "react";
import LoginPage from "./LoginForm";

export default function Login() {
  return (
    <Suspense fallback={<div className="container mx-auto py-12 text-center">Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
}
