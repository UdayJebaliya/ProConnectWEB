"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { AppRoutes } from "@/lib/constants/routes";

export default function RootPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    router.replace(isAuthenticated ? AppRoutes.organizations : AppRoutes.login);
  }, [isLoading, isAuthenticated, router]);

  return null;
}
