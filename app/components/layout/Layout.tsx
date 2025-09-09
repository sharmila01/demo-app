import React from "react";
import { Search, HelpCircle, Bell } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <h1 className="text-xl text-gray-500 font-bold">DemoApp</h1>
        <div className="flex gap-4">
          <button className="p-2 rounded hover:bg-gray-100">
            <Search className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 rounded hover:bg-gray-100">
            <HelpCircle className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 rounded hover:bg-gray-100">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {children}
      </main>
    </div>
  );
}
