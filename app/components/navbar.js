'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { createClient } from "@/utils/supabase/client";

export default function Navbar({ user }) {
    const [username, setUsername] = useState(null);

    useEffect(() => {
        async function fetchUsername() {
            const supabase = createClient();

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('id', user.id)
                    .single();

                if (error) {
                    throw error;
                }

                setUsername(data?.username || 'Unknown');
            } catch (error) {
                console.error('Error fetching username:', error.message);
                setUsername('Unknown');
            }
        }

        if (user) {
            fetchUsername();
        }
    }, [user]);

    if (!user) {
        return <p>Loading...</p>; // or any loading indicator
    }

    return (
        <>
            <Head>
                <link rel="stylesheet" href="../globals.css" />
            </Head>
            <nav>
                <div className="container">
                    <ul className="navbar-list">
                        <li>
                            <Link href="/feed">Home</Link>
                        </li>
                        <li>
                            <Link href={`/${username}`}>Profile</Link>
                        </li>
                        <li>
                            <Link href="/create-post">Create Post</Link>
                        </li>
                        <li>
                        <form onSubmit={(event) => {
                                event.preventDefault(); // Prevent default form submission behavior
                                const searchUsername = event.target.search.value;
                                if (searchUsername) {
                                    window.location.href = `/${searchUsername}`; // Navigate to /username page
                                }
                            }}>
                                <input type="text" name="search" placeholder="Search..." />
                                <button type="submit">Search</button>
                            </form>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    );
}
