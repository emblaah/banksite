"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <section className="hero text-center mt-8">
        <h1 className="text-4xl font-bold">Welcome to your Bank</h1>
        <Link href="/createAccount">
          <button className="bg-blue-500 text-white py-3 px-6 rounded mt-6 hover:bg-blue-700">
            Create Account
          </button>
        </Link>
      </section>
    </div>
  );
}
