"use client";

import { ThemeToggle } from "@/components/theme-toggle";

export default function AdminHome() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-24">
      <div className="fixed top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      <h1 className="text-4xl font-bold">Blueprint Admin</h1>
      <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
        Admin panel
      </p>
    </main>
  );
}
