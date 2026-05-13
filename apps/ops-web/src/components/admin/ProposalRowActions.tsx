"use client";

import Link from "next/link";

export function ProposalRowActions({
  locale,
  proposalId,
}: {
  locale: string;
  proposalId: string;
}) {
  return (
    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
      <Link
        href={`/${locale}/admin/proposals/${proposalId}`}
        className="text-sm text-[#555] hover:text-white">
        Ver detalle
      </Link>
    </div>
  );
}
