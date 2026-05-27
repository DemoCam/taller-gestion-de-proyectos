import "./index.css";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AppProvider, useApp } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import SurveyForm from "./components/SurveyForm";
import EncuestasList from "./components/EncuestasList";
import Analytics from "./components/Analytics";
import Exportar from "./components/Exportar";
import Opciones from "./components/Opciones";
import AppSkeleton from "./components/Skeleton";

function OrbField() {
  return (
    <>
      <div className="orb animate-float" style={{
        width: 500, height: 500, top: -150, left: -100,
        background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
        animationDuration: "8s",
      }} />
      <div className="orb animate-floatR" style={{
        width: 400, height: 400, bottom: -100, right: -80,
        background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
        animationDuration: "11s",
      }} />
      <div className="orb animate-float" style={{
        width: 300, height: 300, top: "40%", right: "20%",
        background: "radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)",
        animationDuration: "14s",
      }} />
    </>
  );
}

function MainContent() {
  const { activeView } = useApp();
  const reduce = useReducedMotion();

  const views = {
    dashboard:  <Dashboard />,
    nueva:      <SurveyForm />,
    encuestas:  <EncuestasList />,
    analytics:  <Analytics />,
    exportar:   <Exportar />,
    opciones:   <Opciones />,
  };

  const variants = reduce
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
        exit:    { opacity: 0, y: -10, transition: { duration: 0.18, ease: "easeIn" } },
      };

  return (
    <main style={{
      flex: 1,
      minWidth: 0,
      overflowY: "auto",
      position: "relative",
      zIndex: 1,
    }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeView}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {views[activeView] || <Dashboard />}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

function Shell() {
  const { loading } = useApp();

  if (loading) return <AppSkeleton />;

  return (
    <div style={{
      position: "relative", zIndex: 1,
      display: "flex", minHeight: "100vh",
    }}>
      <Sidebar />
      <MainContent />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
        {/* Animated background */}
        <div className="mesh-bg" />
        <OrbField />

        {/* Grid noise texture overlay */}
        <div style={{
          position: "fixed", inset: 0, zIndex: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }} />

        <Shell />
      </div>
    </AppProvider>
  );
}
