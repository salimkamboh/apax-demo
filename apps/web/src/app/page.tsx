import Link from "next/link";

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="card">
        <p className="eyebrow">APAX assessment</p>
        <h1>JWT login wired end to end</h1>
        <p>
          This demo connects a Next.js login form to a Node.js/Express API,
          validates a MongoDB user, and stores the signed JWT on success.
        </p>
        <Link className="button-link" href="/login">
          Open login
        </Link>
      </section>
    </main>
  );
}
