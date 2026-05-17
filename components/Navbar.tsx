'use client';

import Image from "next/image"
import Link from "next/link"
import posthog from "posthog-js";

const Navbar = () => {
    const handleNavClick = (label: string, href: string) => {
        posthog.capture("nav_link_clicked", { label, href });
    };

    return(
        <header>
            <nav>
                <Link href="/" className="logo" onClick={() => handleNavClick("Logo", "/")}>
                    <Image src="/icons/logo.png" alt="logo" height={24} width={24} />
                    <p>DevEvent</p>
                </Link>
                <ul>
                    <Link href="/" onClick={() => handleNavClick("Home", "/")}>Home</Link>
                    <Link href="/" onClick={() => handleNavClick("Event", "/")}>Event</Link>
                    <Link href="/" onClick={() => handleNavClick("Create Event", "/")}>Create Event</Link>
                </ul>
            </nav>
        </header>

    )
}


export default Navbar;