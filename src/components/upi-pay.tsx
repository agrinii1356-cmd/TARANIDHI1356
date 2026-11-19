import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { MERCHANT_VPA, upiLink } from "@/lib/billing";
import { useT } from "@/lib/prefs";

export function UpiPay({
  amount,
  note,
  onPaid,
}: {
  amount: number;
  note: string;
  onPaid: () => void;
}) {
  const { t } = useT();
  const link = upiLink(amount, note);
  const [src, setSrc] = useState("");

  useEffect(() => {
    let live = true;
    QRCode.toDataURL(link, {
      margin: 1,
      width: 320,
      color: { dark: "#1c1916", light: "#fffdf8" },
    }).then((url) => {
      if (live) setSrc(url);
    });
    return () => {
      live = false;
    };
  }, [link]);

  return (
    <div className="mt-4 grid items-center gap-4 sm:grid-cols-[auto_1fr]">
      {src ? (
        <img
          src={src}
          alt={`UPI QR for ₹${amount}`}
          className="mx-auto size-52 rounded-xl border border-line bg-surface p-2"
        />
      ) : (
        <div className="mx-auto size-52 rounded-xl bg-surface-2" />
      )}
      <div className="space-y-3 text-sm">
        <p className="text-base leading-relaxed text-muted">
          {t("scan")} The bank sees the payment. This app does not. A scanner cannot tell us the money arrived. After you pay, write the UTR from the bank SMS. The plan turns on in this phone only. Match that UTR in your bank before you trust it.
        </p>
        <p className="tabular-nums">
          ₹{amount} · {MERCHANT_VPA}
        </p>
        <a
          href={link}
          className="flex min-h-11 items-center justify-center rounded-full bg-ink px-4 text-bg"
        >
          {t("openUpi")}
        </a>
        <button
          type="button"
          onClick={onPaid}
          className="flex min-h-11 w-full items-center justify-center rounded-full border border-line px-4"
        >
          {t("paid")}
        </button>
      </div>
    </div>
  );
}
