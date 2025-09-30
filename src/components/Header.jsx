import { useEffect, useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  // Lock body scroll only while the drawer is open
  useEffect(() => {
    const { style } = document.body;
    if (open) {
      style.overflow = "hidden";
    } else {
      style.overflow = "";
    }
    return () => { style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Top bar (high z-index + safe-area padding) */}
      <header
        className="fixed inset-x-0 top-0 z-[9999] bg-white/90 backdrop-blur border-b"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <a href="/" className="font-semibold tracking-wide">Ngọc Anh Services</a>

          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-controls="mobile-menu"
            aria-expanded={open ? "true" : "false"}
            className="inline-flex items-center justify-center rounded-xl px-3 py-2 border"
          >
            <span className="sr-only">Open menu</span>
            {/* simple icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Push page content below fixed header (14 = 56px) */}
      <div className="h-14" style={{ marginTop: "env(safe-area-inset-top)" }} />

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-[9998]"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)} // click outside closes
        >
          {/* Scrim */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Drawer panel (highest z, safe-area paddings, 100dvh so it never cuts) */}
          <nav
            id="mobile-menu"
            className="absolute right-0 top-0 h-[100dvh] w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto p-4 z-[9999]"
            style={{
              paddingTop: "calc(env(safe-area-inset-top) + 16px)",
              paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)",
            }}
            onClick={(e) => e.stopPropagation()} // keep clicks inside from closing
          >
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold">Menu</div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2 border"
              >
                Close
              </button>
            </div>

            <ul className="space-y-2">
              <li><a className="block rounded-lg px-3 py-2 hover:bg-gray-100" href="/send-money">Send Money</a></li>
              <li><a className="block rounded-lg px-3 py-2 hover:bg-gray-100" href="/visa-services">Visa Services</a></li>
              <li><a className="block rounded-lg px-3 py-2 hover:bg-gray-100" href="/vn-passport">VN Passport</a></li>
              <li><a className="block rounded-lg px-3 py-2 hover:bg-gray-100" href="/contact">Contact</a></li>
              {/* add more links as needed */}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
