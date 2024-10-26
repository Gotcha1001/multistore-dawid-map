"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
import { Session } from "next-auth";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header({ session }: { session: Session | null }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const router = useRouter();

  return (
    <header className="border-b p-4 flex justify-between items-center gradient-background2 h-29">
      <div className="flex items-center gap-4 py-2">
        <img
          src="https://github.com/Gotcha1001/My-Images-for-sites-Wes/blob/main/Gamingpic.jpg?raw=true"
          alt="Gaming"
          className="w-16 h-16 rounded-lg object-cover horizontal-spin"
        />
        <Link
          href={"/"}
          className="font-bold text-3xl text-white animate-pulse"
        >
          Multi-Store
        </Link>
      </div>

      {/* Burger Menu Button for Mobile */}
      <button
        onClick={() => setShowMobileMenu((prev) => !prev)}
        className="lg:hidden text-white text-2xl"
      >
        <FontAwesomeIcon icon={showMobileMenu ? faTimes : faBars} />
      </button>

      {/* Full-screen Nav Overlay for Mobile */}
      {showMobileMenu && (
        <nav className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center space-y-6 pt-10 text-white">
          <button
            onClick={() => setShowMobileMenu(false)}
            className="text-2xl self-end mr-6 mt-2"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>

          {/* Links and Profile - Displayed Vertically */}
          <Link
            href="/new"
            onClick={() => setShowMobileMenu(false)}
            className="text-lg px-4 py-2 border border-blue-600 hover:bg-white hover:text-black inline-flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} className="h-4" />
            <span>Post An Add</span>
          </Link>

          {!session?.user ? (
            <>
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  signIn("google");
                }}
                className="border-blue-700 py-2 hover:bg-white hover:text-black text-blue-600 border px-6"
              >
                Login
              </button>
              <button className="text-gray-600">Sign Up</button>
            </>
          ) : (
            <>
              <p className="text-lg">Welcome {session.user.name}</p>
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="relative flex items-center"
              >
                <Image
                  className="rounded-md"
                  src={session.user.image as string}
                  alt="avatar"
                  width={50}
                  height={34}
                />
              </button>

              {showDropdown && (
                <div className="flex flex-col items-center mt-2">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      router.push("/my-ads");
                      router.refresh();
                      setShowMobileMenu(false);
                    }}
                    className="text-white py-2"
                  >
                    My Ads
                  </button>
                  <button
                    onClick={() => {
                      signOut();
                      setShowMobileMenu(false);
                    }}
                    className="text-white py-2"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          )}
        </nav>
      )}

      {/* Desktop Nav */}
      <nav className="hidden lg:flex lg:gap-4 items-center">
        <Link
          href="/new"
          className="mr-4 px-4 border py-2 hover:bg-white hover:text-black border-blue-600 text-blue-500 inline-flex items-center gap-1"
        >
          <FontAwesomeIcon icon={faPlus} className="h-4" />
          <span>Post An Add</span>
        </Link>
        <span className="border-r"></span>

        {!session?.user ? (
          <>
            <button className="text-gray-600">Sign Up</button>
            <button
              onClick={() => signIn("google")}
              className="border-blue-700 py-2 hover:bg-white hover:text-black text-blue-600 border px-6"
            >
              Login
            </button>
          </>
        ) : (
          <>
            <p className="text-white flex items-center text-sm">
              Welcome {session.user.name}
            </p>
            <div className="relative flex items-center">
              <button onClick={() => setShowDropdown((prev) => !prev)}>
                <Image
                  className="rounded-md"
                  src={session.user.image as string}
                  alt="avatar"
                  width={50}
                  height={34}
                />
              </button>

              {showDropdown && (
                <div className="gradient-background5 z-50 rounded-md text-white absolute right-0 top-16 w-24">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      router.push("/my-ads");
                      router.refresh();
                    }}
                    className="p-2 block text-center w-full"
                  >
                    My Ads
                  </button>
                  <button
                    className="p-2 block w-full"
                    onClick={() => signOut()}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </nav>
    </header>
  );
}
