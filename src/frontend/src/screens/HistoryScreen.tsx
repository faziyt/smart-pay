import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownLeft, ArrowUpRight, History, Plus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { TransactionStatus, TransactionType } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useTransactions } from "../hooks/useQueries";
import { formatCurrency, formatDate } from "../utils/format";

export default function HistoryScreen() {
  const { identity } = useInternetIdentity();
  const { data: transactions, isLoading } = useTransactions();
  const [activeTab, setActiveTab] = useState("all");
  const myPrincipal = identity?.getPrincipal().toString() ?? "";

  const allTx = transactions ?? [];
  const sentTx = allTx.filter(
    (tx) =>
      tx.transactionType === TransactionType.send &&
      tx.from?.toString() === myPrincipal,
  );
  const receivedTx = allTx.filter(
    (tx) =>
      (tx.transactionType === TransactionType.send &&
        tx.to?.toString() === myPrincipal) ||
      tx.transactionType === TransactionType.topup,
  );

  const displayTx =
    activeTab === "all" ? allTx : activeTab === "sent" ? sentTx : receivedTx;

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div
        className="px-5 pt-10 pb-6 text-white"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.36 0.17 264) 0%, oklch(0.50 0.19 264) 100%)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <History className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Transaction History</h1>
            <p className="text-white/70 text-sm">
              {allTx.length} transactions total
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 py-5">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList
            className="w-full mb-4 bg-card shadow-xs"
            data-ocid="history.tab"
          >
            <TabsTrigger value="all" className="flex-1" data-ocid="history.tab">
              All
            </TabsTrigger>
            <TabsTrigger
              value="sent"
              className="flex-1"
              data-ocid="history.tab"
            >
              Sent
            </TabsTrigger>
            <TabsTrigger
              value="received"
              className="flex-1"
              data-ocid="history.tab"
            >
              Received
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {isLoading ? (
              <div className="space-y-3" data-ocid="history.loading_state">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-card rounded-xl p-4 flex items-center gap-3 shadow-xs"
                  >
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : displayTx.length === 0 ? (
              <div
                className="bg-card rounded-xl p-10 text-center shadow-xs"
                data-ocid="history.empty_state"
              >
                <div className="w-14 h-14 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center">
                  <History className="w-7 h-7 text-muted-foreground" />
                </div>
                <p className="font-medium text-foreground">No transactions</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Nothing to show here yet
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {displayTx.map((tx, i) => {
                  const isTopup = tx.transactionType === TransactionType.topup;
                  const isSent =
                    !isTopup && tx.from?.toString() === myPrincipal;
                  const isSuccess = tx.status === TransactionStatus.completed;

                  const label = isTopup
                    ? "Top-up"
                    : isSent
                      ? `Sent to ${tx.to?.toString().slice(0, 10)}...`
                      : `Received from ${tx.from?.toString().slice(0, 10)}...`;

                  return (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.03, 0.3) }}
                      className="bg-card rounded-xl p-4 flex items-center gap-3 shadow-xs"
                      data-ocid={`history.item.${i + 1}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isTopup
                            ? "bg-violet-100"
                            : isSent
                              ? "bg-red-50"
                              : "bg-emerald-50"
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
                        <p className="text-sm font-medium text-foreground truncate">
                          {label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDate(tx.timestamp)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <p
                          className={`text-sm font-bold ${
                            isSent ? "text-destructive" : "text-success"
                          }`}
                        >
                          {isSent ? "-" : "+"}
                          {formatCurrency(tx.amount)}
                        </p>
                        <Badge
                          variant={isSuccess ? "default" : "destructive"}
                          className={`text-xs px-1.5 py-0 h-4 ${
                            isSuccess
                              ? "bg-emerald-50 text-success hover:bg-emerald-100"
                              : ""
                          }`}
                        >
                          {tx.status}
                        </Badge>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
