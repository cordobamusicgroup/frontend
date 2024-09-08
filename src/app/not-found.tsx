import Link from "next/link";

export default function NotFound() {
  return (
    <div className="global">
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/portal">Return Home</Link>
    </div>
  );
}
