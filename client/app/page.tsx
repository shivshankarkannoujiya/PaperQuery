import ChatComponent from "./components/Chat";
import FileUploadComponent from "./components/File-upload";

export default function Home() {
  return (
    // Locked exactly to the viewport — no page-level scroll
    <div className="h-screen w-screen overflow-hidden bg-[#0a0a0a] flex flex-col">
      {/* ── Navbar ── */}
      <header className="shrink-0 w-full px-6 py-4 flex items-center justify-between border-b border-[#1e1e1e]">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-[#c9a96e]" />
          <span
            className="text-[#c9a96e] text-sm tracking-[0.25em] uppercase font-extrabold"
            style={{ fontFamily: "Georgia, serif" }}
          >
            paperquery
          </span>
        </div>
        <span className="text-[#a8a3a3] text-xs tracking-widest uppercase hidden sm:block font-bold">
          PDF · AI · Analysis
        </span>
      </header>

      {/* ── Body (fills remaining height, no overflow) ── */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar */}
        <aside
          className="
          shrink-0
          w-full h-auto lg:h-full
          lg:w-75 xl:w-85
          flex flex-col items-center justify-center gap-6
          px-6 py-8
          border-b lg:border-b-0 lg:border-r border-[#1e1e1e]
          overflow-y-auto
        "
        >
          <div className="w-full max-w-60">
            <p
              className="text-[10px] text-[#444] tracking-[0.3em] uppercase mb-5"
              style={{ fontFamily: "Georgia, serif" }}
            >
              01 — Document
            </p>
            <FileUploadComponent />
          </div>

          <div className="w-full max-w-60 flex flex-col gap-3">
            <div className="h-px bg-linear-to-r from-transparent via-[#2a2a2a] to-transparent" />
            <p className="text-[#676262] text-[10px] text-center tracking-widest uppercase leading-relaxed">
              Upload a PDF to begin your analysis
            </p>
          </div>
        </aside>

        {/* Chat — fills all remaining space */}
        <main className="flex-1 min-h-0 min-w-0 overflow-hidden">
          <ChatComponent />
        </main>
      </div>
    </div>
  );
}
