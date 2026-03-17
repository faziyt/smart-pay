import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Loader2, Plus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useTopUp } from "../hooks/useQueries";

const PRESET_AMOUNTS = [10, 25, 50, 100];

export default function AddBalanceScreen() {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const topUp = useTopUp();

  const handlePreset = (val: number) => {
    setAmount(String(val));
    setError("");
  };

  const handleAdd = async () => {
    const num = Number.parseFloat(amount);
    if (!amount || Number.isNaN(num) || num <= 0) {
      setError("Enter a valid amount");
      return;
    }
    setError("");
    try {
      await topUp.mutateAsync(BigInt(Math.round(num * 100)));
      setSuccess(true);
      setAmount("");
      toast.success(`$${num.toFixed(2)} added to your wallet!`);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      toast.error(e?.message || "Failed to add balance");
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div
        className="px-5 pt-10 pb-8 text-white"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.38 0.18 285) 0%, oklch(0.52 0.17 275) 100%)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Add Balance</h1>
            <p className="text-white/70 text-sm">
              Top up your Smart Pay wallet
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 py-6">
        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl shadow-card p-10 text-center"
            data-ocid="add_balance.success_state"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-50 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              Balance Added!
            </h3>
            <p className="text-sm text-muted-foreground">
              Your wallet has been topped up
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Preset amounts */}
            <div className="bg-card rounded-2xl shadow-card p-5">
              <p className="text-sm font-semibold text-foreground mb-3">
                Quick Select
              </p>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_AMOUNTS.map((val) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => handlePreset(val)}
                    className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                      amount === String(val)
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-border bg-background text-foreground hover:border-blue-300"
                    }`}
                    data-ocid="add_balance.toggle"
                  >
                    ${val}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom amount */}
            <div className="bg-card rounded-2xl shadow-card p-5 space-y-4">
              <div>
                <Label
                  htmlFor="add-amount"
                  className="text-sm font-semibold text-foreground"
                >
                  Custom Amount
                </Label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">
                    $
                  </span>
                  <Input
                    id="add-amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setError("");
                    }}
                    className="pl-7"
                    min="0"
                    step="0.01"
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    data-ocid="add_balance.input"
                  />
                </div>
                {error && (
                  <p
                    className="text-xs text-destructive mt-1"
                    data-ocid="add_balance.error_state"
                  >
                    {error}
                  </p>
                )}
              </div>

              <Button
                onClick={handleAdd}
                disabled={topUp.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl shadow-blue"
                data-ocid="add_balance.submit_button"
              >
                {topUp.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Adding...
                  </>
                ) : (
                  "Add to Wallet"
                )}
              </Button>
            </div>

            {/* Note */}
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-xs text-blue-700 font-medium">
                This is a simulated top-up for demonstration purposes. No real
                payment is processed.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
