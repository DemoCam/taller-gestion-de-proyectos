// Skeleton loading screen — mirrors the real app layout (sidebar + dashboard)
// with shimmering placeholders while initial data settles.

function Block({ w = "100%", h = 16, r = 10, style }) {
  return <div className="skeleton" style={{ width: w, height: h, borderRadius: r, ...style }} />;
}

function SidebarSkeleton() {
  return (
    <aside style={{
      width: 240,
      minHeight: "100vh",
      background: "rgba(3,7,18,0.8)",
      backdropFilter: "blur(24px)",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      display: "flex",
      flexDirection: "column",
      padding: "1.5rem 1rem",
      flexShrink: 0,
      gap: "1rem",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", paddingLeft: "0.5rem" }}>
        <Block w={36} h={36} r={10} />
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <Block w={90} h={10} />
          <Block w={120} h={8} />
        </div>
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <Block key={i} w="100%" h={38} r={12} />
      ))}
      <div style={{ marginTop: "auto" }}>
        <Block w="100%" h={72} r={14} />
      </div>
    </aside>
  );
}

function DashboardSkeleton() {
  return (
    <div style={{ flex: 1, padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <Block w={180} h={26} />
          <Block w={260} h={12} />
        </div>
        <Block w={150} h={32} r={10} />
      </div>

      {/* stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="glass" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Block w={90} h={10} />
              <Block w={40} h={40} r={10} />
            </div>
            <Block w={70} h={28} />
            <Block w={110} h={9} />
          </div>
        ))}
      </div>

      {/* chart row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="glass" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Block w={160} h={12} />
            <Block w="100%" h={200} r={14} />
          </div>
        ))}
      </div>

      {/* wide chart */}
      <div className="glass" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Block w={200} h={12} />
        <Block w="100%" h={180} r={14} />
      </div>
    </div>
  );
}

export default function AppSkeleton() {
  return (
    <div style={{ position: "relative", zIndex: 1, display: "flex", minHeight: "100vh" }}>
      <SidebarSkeleton />
      <main style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>
        <DashboardSkeleton />
      </main>
    </div>
  );
}
