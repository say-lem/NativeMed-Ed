"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AlertTriangle, CalendarDays, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useConfirm } from "@/components/shared/ConfirmDialog";
import { isBookingPast } from "@/lib/date";
import { formatMoney } from "@/lib/price";
import type { AdminBookingProduct } from "@/types/api";
import BookingProductFormModal from "./BookingProductFormModal";
import ManageDatesModal from "./ManageDatesModal";
import { deleteBookingProductAction, setBookingProductPublishedAction } from "../actions";

export default function BookingProductsManager({
  products,
}: {
  products: AdminBookingProduct[];
}) {
  const router = useRouter();
  const confirm = useConfirm();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<AdminBookingProduct | null>(null);
  const [managingDatesId, setManagingDatesId] = useState<string | null>(null);
  const [, startAction] = useTransition();

  // Derived from the live `products` prop (not a snapshot) so the dates modal reflects
  // additions/removals immediately after each `router.refresh()`, instead of going stale.
  const managingDates = products.find((p) => p._id === managingDatesId) ?? null;

  const togglePublished = (product: AdminBookingProduct) => {
    setBusyId(product._id);
    startAction(async () => {
      const res = await setBookingProductPublishedAction(product._id, !product.isPublished);
      if (res.ok) toast.success(res.message ?? "Updated");
      else toast.error(res.message ?? "Something went wrong");
      setBusyId(null);
      router.refresh();
    });
  };

  const remove = async (product: AdminBookingProduct) => {
    const ok = await confirm({
      title: "Delete session product?",
      message: `"${product.title}" and every booking made against it will be permanently removed.`,
      confirmText: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    setBusyId(product._id);
    startAction(async () => {
      const res = await deleteBookingProductAction(product._id);
      if (res.ok) toast.success(res.message ?? "Session product deleted");
      else toast.error(res.message ?? "Something went wrong");
      setBusyId(null);
      router.refresh();
    });
  };

  return (
    <div className="rounded-[16px] border border-[#EDEDED] p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-black-others">
          Session products ({products.length})
        </h2>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 rounded-full bg-primary-100 text-white text-sm font-semibold px-5 py-2.5 cursor-pointer"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="mt-5 divide-y divide-[#EDEDED]">
        {products.length === 0 ? (
          <p className="text-center text-subtle-text py-10">No session products yet.</p>
        ) : (
          products.map((product) => {
            const busy = busyId === product._id;
            // A date is still "open" if at least one of the product's times hasn't been
            // booked AND hasn't already passed — a date can clear the old "not fully
            // booked" bar yet still be unbookable because every slot on it is in the past
            // (exactly what the public booking page checks before showing it).
            const dates = product.availableDates ?? [];
            const times = product.availableTimes ?? [];
            const availableCount = dates.filter((d) =>
              times.some(
                (t) =>
                  !(d.bookedTimes ?? []).includes(t) && !isBookingPast(d.date, t),
              ),
            ).length;
            // No `availableTimes` at all means `.some()` above is vacuously false for
            // every date regardless of how far in the future it is — that's a "no times
            // configured" problem, not an "expired" one, and needs its own message so a
            // product with perfectly good future dates doesn't get told they've all passed.
            const noTimesConfigured = times.length === 0;
            const allDatesExpired =
              !noTimesConfigured && availableCount === 0 && dates.length > 0;
            return (
              <div
                key={product._id}
                className="flex flex-wrap items-center justify-between gap-3 py-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {product.imageUrl ? (
                    <div className="relative size-11 rounded-[8px] overflow-hidden shrink-0 border border-[#EDEDED]">
                      <Image
                        src={product.imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    </div>
                  ) : (
                    <span className="grid place-items-center size-11 rounded-[8px] bg-primary-10 text-primary-100 shrink-0">
                      <CalendarDays size={18} />
                    </span>
                  )}
                  <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-black-others truncate">
                      {product.title}
                    </p>
                    <span className="rounded-full bg-primary-10 px-2 py-0.5 text-xs text-primary-100">
                      {formatMoney(product.price)}
                    </span>
                    {!product.isPublished && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-subtle-text">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-subtle-text line-clamp-1 mt-0.5">
                    {product.description}
                  </p>
                  <p className="text-xs text-subtle-text mt-0.5">
                    {availableCount} open date{availableCount === 1 ? "" : "s"} ·{" "}
                    {times.length} time
                    {times.length === 1 ? "" : "s"}
                  </p>
                  {noTimesConfigured ? (
                    <p className="text-xs text-amber-600 mt-0.5 flex items-center gap-1">
                      <AlertTriangle size={12} />
                      No session times configured — edit this product to add some
                    </p>
                  ) : (
                    allDatesExpired && (
                      <p className="text-xs text-amber-600 mt-0.5 flex items-center gap-1">
                        <AlertTriangle size={12} />
                        All dates have passed — add new ones
                      </p>
                    )
                  )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setManagingDatesId(product._id)}
                    disabled={busy}
                    className="flex items-center justify-center gap-1.5 rounded-[8px] border border-[#EDEDED] text-subtle-text hover:bg-[#FAFAFA] text-xs font-medium px-3 py-1.5 cursor-pointer disabled:opacity-60"
                  >
                    <CalendarDays size={12} />
                    Dates
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePublished(product)}
                    disabled={busy}
                    className="rounded-[8px] border border-[#EDEDED] text-subtle-text hover:bg-[#FAFAFA] text-xs font-medium px-3 py-1.5 cursor-pointer disabled:opacity-60"
                  >
                    {product.isPublished ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(product)}
                    disabled={busy}
                    className="flex items-center justify-center gap-1.5 rounded-[8px] border border-[#EDEDED] text-subtle-text hover:bg-[#FAFAFA] text-xs font-medium px-3 py-1.5 cursor-pointer disabled:opacity-60"
                  >
                    <Pencil size={12} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(product)}
                    disabled={busy}
                    className="flex items-center justify-center gap-1.5 rounded-[8px] border border-[#FFC9C9] text-[#C11616] hover:bg-[#FFE6E6] text-xs font-medium px-3 py-1.5 cursor-pointer disabled:opacity-60"
                  >
                    {busy ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {creating && (
        <BookingProductFormModal
          onClose={() => setCreating(false)}
          onSaved={() => {
            setCreating(false);
            router.refresh();
          }}
        />
      )}

      {editing && (
        <BookingProductFormModal
          product={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            router.refresh();
          }}
        />
      )}

      {managingDates && (
        <ManageDatesModal product={managingDates} onClose={() => setManagingDatesId(null)} />
      )}
    </div>
  );
}
