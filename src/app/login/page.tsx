"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { AppRoutes } from "@/lib/constants/routes";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(AppRoutes.organizations);
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">ProConnect</h1>
        <p className="mt-1 text-sm text-gray-500">Sign in to your account</p>
      </div>
      <LoginForm />
    </div>
  );
}
