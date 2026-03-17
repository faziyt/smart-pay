import { Button } from "@/components/ui/button";
import { ArrowDownLeft, CheckCheck, Copy, QrCode } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function ReceiveScreen() {
  const { identity } = useInternetIdentity();
  const [copied, setCopied] = useState(false);

  const principalId = identity?.getPrincipal().toString() ?? "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(principalId);
    setCopied(true);
    toast.success("Principal ID copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div
        className="px-5 pt-10 pb-8 text-white"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.42 0.17 152) 0%, oklch(0.55 0.15 165) 100%)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <ArrowDownLeft className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Receive Money</h1>
            <p className="text-white/70 text-sm">Share your ID to get paid</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 py-6 space-y-4">
        {/* QR code placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-2xl shadow-card p-6"
        >
          <div className="text-center mb-5">
            <h3 className="font-bold text-foreground">Your Payment ID</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Share this with anyone to receive payments
            </p>
          </div>

          {/* QR Code visual */}
          <div
            className="mx-auto w-48 h-48 rounded-2xl flex flex-col items-center justify-center mb-5"
            style={{ background: "oklch(0.94 0.04 240)" }}
            data-ocid="receive.canvas_target"
          >
            <QrCode className="w-20 h-20 text-blue-600 mb-2" />
            <p className="text-xs text-muted-foreground text-center px-2 font-mono leading-tight break-all">
              {principalId.slice(0, 20)}...
            </p>
          </div>

          {/* Principal ID text */}
          <div className="bg-muted rounded-xl p-3 mb-4">
            <p className="text-xs text-muted-foreground mb-1 font-medium">
              Principal ID
            </p>
            <p className="text-sm font-mono text-foreground break-all leading-relaxed">
              {principalId}
            </p>
          </div>

          <Button
            onClick={handleCopy}
            className="w-full rounded-xl font-semibold"
            style={{ background: copied ? "oklch(0.42 0.17 152)" : undefined }}
            data-ocid="receive.upload_button"
          >
            {copied ? (
              <>
                <CheckCheck className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy ID
              </>
            )}
          </Button>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl shadow-card p-5"
        >
          <h4 className="font-semibold text-foreground mb-3">
            How to receive money
          </h4>
          <div className="space-y-3">
            {[
              { step: 1, text: "Share your Principal ID with the sender" },
              {
                step: 2,
                text: "Ask them to paste it in the Send Money screen",
              },
              {
                step: 3,
                text: "Your balance updates instantly after transfer",
              },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">{step}</span>
                </div>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
