import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap grid min-h-[70vh] place-items-center pt-28 text-center">
      <div>
        <p className="display text-[clamp(5rem,18vw,12rem)] text-gradient">404</p>
        <h1 className="font-display text-2xl font-semibold">That page isn’t here.</h1>
        <p className="mt-2 text-mist">The product may have sold out, or the link has changed.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/shop" className="btn btn-primary">Go to shop</Link>
          <Link href="/request" className="btn btn-ghost">Request it</Link>
        </div>
      </div>
    </div>
  );
}
