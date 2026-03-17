import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  History,
  Plus,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { TransactionType } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useBalance,
  useTransactions,
  useUserProfile,
} from "../hooks/useQueries";
import { formatCurrency, formatDate } from "../utils/format";

interface DashboardProps {
  onNavigate: (screen: string) => void;
}

export default function DashboardScreen({ onNavigate }: DashboardProps) {
  const { identity } = useInternetIdentity();
  const { data: balance, isLoading: balanceLoading } = useBalance();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: transactions, isLoading: txLoading } = useTransactions();

  const principalStr = identity?.getPrincipal().toString() ?? "";
  const displayName = profile?.username || `${principalStr.slice(0, 8)}...`;
  const recentTx = (transactions ?? []).slice(0, 5);

  const quickActions = [
    { icon: ArrowUpRight, label: "Send", screen: "send", color: "bg-blue-600" },
    {
      icon: ArrowDownLeft,
      label: "Receive",
      screen: "receive",
      color: "bg-emerald-500",
    },
    {
      icon: Plus,
      label: "Add Money",
      screen: "add-balance",
      color: "bg-violet-500",
    },
    {
      icon: History,
      label: "History",
      screen: "history",
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide pb-6">
      {/* Blue gradient header */}
      <div
        className="relative px-5 pt-10 pb-8 text-white"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.36 0.17 264) 0%, oklch(0.50 0.19 264) 60%, oklch(0.55 0.16 248) 100%)",
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
          style={{ background: "white", transform: "translate(30%, -30%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10"
          style={{ background: "white", transform: "translate(-20%, 40%)" }}
        />

        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white/70 text-sm font-medium">Hello,</p>
              {profileLoading ? (
                <Skeleton className="h-6 w-32 bg-white/20 mt-1" />
              ) : (
                <p className="text-lg font-bold truncate max-w-[200px]">
                  {displayName}
                </p>
              )}
            </div>
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              onClick={() => onNavigate("profile")}
            >
              <TrendingUp className="w-5 h-5 text-white" />
            </button>
          </div>

          <p className="text-white/70 text-sm mb-1">Available Balance</p>
          {balanceLoading ? (
            <Skeleton className="h-10 w-44 bg-white/20" />
          ) : (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-4xl font-bold tracking-tight"
            >
              {formatCurrency(balance ?? 0n)}
            </motion.p>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-5 -mt-2 mb-6">
        <div className="bg-card rounded-2xl shadow-card p-4">
          <div className="grid grid-cols-4 gap-2">
            {quickActions.map((action, i) => (
              <motion.button
                type="button"
                key={action.screen}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => onNavigate(action.screen)}
                className="flex flex-col items-center gap-2 py-2"
                data-ocid={`dashboard.${action.label.toLowerCase().replace(" ", "_")}.button`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${action.color} flex items-center justify-center shadow-sm`}
                >
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium text-foreground text-center leading-tight">
                  {action.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-foreground text-base">
            Recent Transactions
          </h3>
          <button
            type="button"
            onClick={() => onNavigate("history")}
            className="text-blue-600 text-sm font-medium flex items-center gap-0.5 hover:text-blue-700"
            data-ocid="dashboard.history.link"
          >
            See all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {txLoading ? (
          <div className="space-y-3" data-ocid="dashboard.loading_state">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card rounded-xl p-4 flex items-center gap-3 shadow-xs"
              >
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        ) : recentTx.length === 0 ? (
          <div
            className="bg-card rounded-xl p-8 text-center shadow-xs"
            data-ocid="dashboard.empty_state"
          >
            <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center">
              <History className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">
              No transactions yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Your activity will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentTx.map((tx, i) => (
              <TransactionRow
                key={tx.id}
                tx={tx}
                index={i + 1}
                myPrincipal={principalStr}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TransactionRow({
  tx,
  index,
  myPrincipal,
}: { tx: any; index: number; myPrincipal: string }) {
  const isTopup = tx.transactionType === TransactionType.topup;
  const isSent = !isTopup && tx.from?.toString() === myPrincipal;

  const label = isTopup
    ? "Top-up"
    : isSent
      ? `Sent to ${tx.to?.toString().slice(0, 8)}...`
      : `Received from ${tx.from?.toString().slice(0, 8)}...`;
  const amountStr = formatCurrency(tx.amount);
  const amountClass = isSent ? "text-destructive" : "text-success";
  const prefix = isSent ? "-" : "+";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-card rounded-xl p-4 flex items-center gap-3 shadow-xs"
      data-ocid={`dashboard.item.${index}`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          isTopup ? "bg-violet-100" : isSent ? "bg-red-50" : "bg-emerald-50"
        }`}
      >
        {isTopup ? (
          <Plus className="w-4 h-4 text-violet-600" />
        ) : isSent ? (
          <ArrowUpRight className="w-4 h-4 text-destructive" />
        ) : (
          <ArrowDownLeft className="w-4 h-4 text-success" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatDate(tx.timestamp)}
        </p>
      </div>
      <p className={`text-sm font-bold ${amountClass} flex-shrink-0`}>
        {prefix}
        {amountStr}
      </p>
    </motion.div>
  );
}
