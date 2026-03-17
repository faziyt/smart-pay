import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Principal } from "@icp-sdk/core/principal";
import { ArrowUpRight, CheckCircle, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useSendMoney } from "../hooks/useQueries";
import { formatCurrency } from "../utils/format";

export default function SendScreen() {
  const [recipientId, setRecipientId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const sendMoney = useSendMoney();

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!recipientId.trim()) errs.recipientId = "Recipient ID is required";
    if (!amount) errs.amount = "Amount is required";
    else if (
      Number.isNaN(Number.parseFloat(amount)) ||
      Number.parseFloat(amount) <= 0
    )
      errs.amount = "Enter a valid amount";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleConfirm = async () => {
    try {
      const principal = Principal.fromText(recipientId.trim());
      const amountCents = BigInt(Math.round(Number.parseFloat(amount) * 100));
      await sendMoney.mutateAsync({ to: principal, amount: amountCents });
      setShowConfirm(false);
      setSuccess(true);
      setRecipientId("");
      setAmount("");
      setNote("");
      toast.success("Money sent successfully!");
    } catch (e: any) {
      setShowConfirm(false);
      toast.error(e?.message || "Transaction failed");
    }
  };

  const amountCents = amount
    ? BigInt(Math.round(Number.parseFloat(amount) * 100))
    : 0n;

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div
        className="px-5 pt-10 pb-8 text-white"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.36 0.17 264) 0%, oklch(0.50 0.19 264) 100%)",
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Send Money</h1>
            <p className="text-white/70 text-sm">Transfer to any user</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 py-6">
        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl shadow-card p-8 text-center"
            data-ocid="send.success_state"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-50 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              Transfer Complete!
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Your money has been sent successfully
            </p>
            <Button
              onClick={() => setSuccess(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              data-ocid="send.primary_button"
            >
              Send Another
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl shadow-card p-5 space-y-5"
          >
            <div>
              <Label
                htmlFor="recipient-id"
                className="text-sm font-semibold text-foreground"
              >
                Recipient ID
              </Label>
              <Input
                id="recipient-id"
                placeholder="Paste recipient's Principal ID"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                className="mt-1.5"
                data-ocid="send.input"
              />
              {errors.recipientId && (
                <p
                  className="text-xs text-destructive mt-1"
                  data-ocid="send.error_state"
                >
                  {errors.recipientId}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="send-amount"
                className="text-sm font-semibold text-foreground"
              >
                Amount (USD)
              </Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">
                  $
                </span>
                <Input
                  id="send-amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-7"
                  min="0"
                  step="0.01"
                  data-ocid="send.input"
                />
              </div>
              {errors.amount && (
                <p
                  className="text-xs text-destructive mt-1"
                  data-ocid="send.error_state"
                >
                  {errors.amount}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="send-note"
                className="text-sm font-semibold text-foreground"
              >
                Note (optional)
              </Label>
              <Textarea
                id="send-note"
                placeholder="What's this for?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-1.5 resize-none"
                rows={2}
                data-ocid="send.textarea"
              />
            </div>

            <Button
              onClick={() => {
                if (validate()) setShowConfirm(true);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl shadow-blue"
              data-ocid="send.primary_button"
            >
              Continue
            </Button>
          </motion.div>
        )}
      </div>

      {/* Confirmation modal */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent
          className="sm:max-w-sm rounded-2xl"
          data-ocid="send.dialog"
        >
          <DialogHeader>
            <DialogTitle>Confirm Transfer</DialogTitle>
            <DialogDescription>
              Please review your transaction details before proceeding.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="bg-muted rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground">You are sending</p>
              <p className="text-3xl font-bold text-foreground mt-1">
                {formatCurrency(amountCents)}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">To</span>
                <span className="font-medium text-foreground text-right max-w-[160px] truncate">
                  {recipientId}
                </span>
              </div>
              {note && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Note</span>
                  <span className="font-medium text-foreground">{note}</span>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
              className="flex-1 rounded-xl"
              data-ocid="send.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={sendMoney.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              data-ocid="send.confirm_button"
            >
              {sendMoney.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                "Confirm Send"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
