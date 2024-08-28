import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div>
      <h1>WELCOME TO TEXTAGRAM!</h1>
      <h3>Click below to Login or Signup if you don't have an account!</h3>
      <Link href="/login">
        <button>Login/Signup</button>
      </Link>
      </div>
    </main>
  );
}
