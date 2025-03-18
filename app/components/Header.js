"use client";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex justify-between">
        <li>
          <Link href="/">
            <div className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
              SwedenBank
            </div>
          </Link>
        </li>
        <div className="flex gap-2">
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
        </div>
      </ul>
    </nav>
  );
}
