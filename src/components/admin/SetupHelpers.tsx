"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { copyPhotosAction, importStarterAction } from "@/app/admin/actions";

export function SetupHelpers({ empty }: { empty: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [note, setNote] = useState<string | null>(null);

  const importStarter = () =>
    start(async () => {
      const r = await importStarterAction();
      setNote(r.ok ? (r.message ?? "Imported.") : r.error);
      router.refresh();
    });

  const copyPhotos = () =>
    start(async () => {
      let total = 0;
      for (let round = 0; round < 20; round++) {
        const r = await copyPhotosAction();
        if (!r.ok) return setNote(r.error);
        total += r.copied ?? 0;
        setNote(`Copying photos… ${total} done`);
        if (!r.remaining || !r.copied) break;
      }
      setNote(`Done. ${total} photos copied to your own storage.`);
      router.refresh();
    });

  return (
    <div className="mt-6 space-y-3">
      {empty && (
        <div className="flex flex-col gap-3 rounded-3xl bg-glow/10 p-5 ring-1 ring-glow/30 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm"><span className="font-semibold">Your database is empty.</span> Import the 30 products from the old site (with their photos) to get started.</p>
          <button type="button" onClick={importStarter} disabled={pending} className="btn btn-primary btn-sm">{pending ? "Importing…" : "Import 30 products"}</button>
        </div>
      )}
      {!empty && (
        <details className="rounded-3xl border border-line px-5 py-4 text-sm">
          <summary className="cursor-pointer font-semibold">Setup tools</summary>
          <p className="mt-3 text-mist">Photos imported from the old site still load from the old site&rsquo;s storage. Copy them into your own storage so they keep working if the old site is shut down.</p>
          <button type="button" onClick={copyPhotos} disabled={pending} className="btn btn-ghost btn-sm mt-3">{pending ? "Working…" : "Copy photos to our storage"}</button>
        </details>
      )}
      {note && <p role="status" className="text-sm text-glow">{note}</p>}
    </div>
  );
}
