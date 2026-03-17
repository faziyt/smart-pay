import { Toaster } from "@/components/ui/sonner";
import { History, Home, Send, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useBalance, useTopUp, useUserProfile } from "./hooks/useQueries";
import AddBalanceScreen from "./screens/AddBalanceScreen";
import AuthScreen from "./screens/AuthScreen";
import DashboardScreen from "./screens/DashboardScreen";
import HistoryScreen from "./screens/HistoryScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ReceiveScreen from "./screens/ReceiveScreen";
import SendScreen from "./screens/SendScreen";

type Screen =
  | "home"
  | "send"
  | "receive"
  | "history"
  | "add-balance"
  | "profile";

const BOTTOM_NAV: { id: Screen; icon: any; label: string }[] = [
  { id: "home", icon: Home, label: "Home" },
  { id: "send", icon: Send, label: "Send" },
  { id: "history", icon: History, label: "History" },
  { id: "profile", icon: User, label: "Profile" },
];

function AppInner() {
  const { identity, isInitializing } = useInternetIdentity();
  const { actor, isFetching } = useActor();
  const { data: balance } = useBalance();
  const { data: profile } = useUserProfile();
  const topUp = useTopUp();
  const [activeScreen, setActiveScreen] = useState<Screen>("home");
  const [initialized, setInitialized] = useState(false);

  const mutate = topUp.mutate;

  // Give new users starting balance
  useEffect(() => {
    if (!actor || isFetching || initialized) return;
    if (balance === undefined || profile === undefined) return;
    setInitialized(true);
    if (balance === 0n) {
      mutate(100000n);
    }
  }, [actor, isFetching, balance, profile, initialized, mutate]);

  const handleNavigate = useCallback((screen: string) => {
    setActiveScreen(screen as Screen);
  }, []);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <p className="text-muted-foreground text-sm">Loading Smart Pay...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return <AuthScreen onAuthenticated={() => {}} />;
  }

  const isBottomNav = ["home", "send", "history", "profile"].includes(
    activeScreen,
  );

  return (
    <div className="min-h-screen bg-background flex items-start justify-center py-0 md:py-6">
      {/* Mobile container */}
      <div
        className="relative w-full max-w-[430px] md:max-w-[390px] flex flex-col bg-background"
        style={{ minHeight: "100svh", maxHeight: "100svh", overflow: "hidden" }}
      >
        {/* Screen content area */}
        <div
          className="flex-1 overflow-hidden"
          style={{ paddingBottom: isBottomNav ? "64px" : "0" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="h-full overflow-y-auto scrollbar-hide"
            >
              {activeScreen === "home" && (
                <DashboardScreen onNavigate={handleNavigate} />
              )}
              {activeScreen === "send" && <SendScreen />}
              {activeScreen === "receive" && <ReceiveScreen />}
              {activeScreen === "history" && <HistoryScreen />}
              {activeScreen === "add-balance" && <AddBalanceScreen />}
              {activeScreen === "profile" && <ProfileScreen />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom navigation */}
        {isBottomNav && (
          <nav
            className="absolute bottom-0 left-0 right-0 bg-card border-t border-border flex items-center"
            style={{ height: "64px" }}
            data-ocid="nav.panel"
          >
            {BOTTOM_NAV.map(({ id, icon: Icon, label }) => {
              const isActive = activeScreen === id;
              return (
                <button
                  type="button"
                  key={id}
                  onClick={() => setActiveScreen(id)}
                  className="flex-1 flex flex-col items-center justify-center gap-1 h-full transition-colors"
                  data-ocid={`nav.${id}.link`}
                >
                  <div
                    className={`relative flex items-center justify-center w-8 h-8 rounded-xl transition-all ${
                      isActive ? "bg-blue-50" : ""
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        isActive ? "text-blue-600" : "text-muted-foreground"
                      }`}
                    />
                    {isActive && (
                      <motion.div
                        layoutId="nav-dot"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-600"
                      />
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-medium transition-colors ${
                      isActive ? "text-blue-600" : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Back button for sub-screens */}
        {!isBottomNav && (
          <button
            type="button"
            onClick={() => setActiveScreen("home")}
            className="absolute top-4 left-4 z-10 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm"
            data-ocid="nav.home.link"
          >
            <span className="text-white text-sm">←</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <AppInner />
      <Toaster position="top-center" richColors />
    </>
  );
}
