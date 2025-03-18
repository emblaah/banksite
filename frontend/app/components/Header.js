"use client";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex justify-around list-none">
        <li>
          <Link href="/">
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
              Home
            </button>
          </Link>
        </li>
        <li>
          <Link href="/login">
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
              Login
            </button>
          </Link>
        </li>
        <li>
          <Link href="/createAccount">
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
            Create Account
          </button>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
