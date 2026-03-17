import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCheck, Copy, Loader2, LogOut, Pencil, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSetUsername, useUserProfile } from "../hooks/useQueries";

export default function ProfileScreen() {
  const { identity, clear } = useInternetIdentity();
  const { data: profile, isLoading } = useUserProfile();
  const setUsername = useSetUsername();

  const [username, setUsernameInput] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [copied, setCopied] = useState(false);

  const principalId = identity?.getPrincipal().toString() ?? "";
  const displayName = profile?.username || "No username set";

  const handleCopyId = async () => {
    await navigator.clipboard.writeText(principalId);
    setCopied(true);
    toast.success("Principal ID copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveUsername = async () => {
    if (!username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }
    try {
      await setUsername.mutateAsync(username.trim());
      toast.success("Username updated!");
      setEditMode(false);
      setUsernameInput("");
    } catch (e: any) {
      toast.error(e?.message || "Failed to update username");
    }
  };

  const handleLogout = () => {
    clear();
    toast.success("Logged out successfully");
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div
        className="px-5 pt-10 pb-10 text-white"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.36 0.17 264) 0%, oklch(0.50 0.19 264) 100%)",
        }}
      >
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-3">
            <User className="w-10 h-10 text-white" />
          </div>
          {isLoading ? (
            <div className="h-6 w-32 bg-white/20 rounded animate-pulse mb-1" />
          ) : (
            <p className="text-lg font-bold">{displayName}</p>
          )}
          <p className="text-white/60 text-xs mt-1">Smart Pay User</p>
        </div>
      </div>

      <div className="flex-1 px-5 py-5 space-y-4 -mt-2">
        {/* Principal ID card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl shadow-card p-5"
        >
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Your Principal ID
          </p>
          <p className="text-xs font-mono text-foreground break-all leading-relaxed mb-3">
            {principalId}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyId}
            className="w-full rounded-xl"
            data-ocid="profile.upload_button"
          >
            {copied ? (
              <>
                <CheckCheck className="w-3.5 h-3.5 mr-1.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                Copy ID
              </>
            )}
          </Button>
        </motion.div>

        {/* Username edit */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card rounded-2xl shadow-card p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-foreground">Username</p>
            {!editMode && (
              <button
                type="button"
                onClick={() => {
                  setEditMode(true);
                  setUsernameInput(profile?.username ?? "");
                }}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
                data-ocid="profile.edit_button"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
            )}
          </div>

          {editMode ? (
            <div className="space-y-3">
              <div>
                <Label
                  htmlFor="profile-username"
                  className="text-sm font-medium"
                >
                  New Username
                </Label>
                <Input
                  id="profile-username"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="mt-1.5"
                  onKeyDown={(e) => e.key === "Enter" && handleSaveUsername()}
                  data-ocid="profile.input"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditMode(false)}
                  className="flex-1 rounded-xl"
                  data-ocid="profile.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveUsername}
                  disabled={setUsername.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                  data-ocid="profile.save_button"
                >
                  {setUsername.isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      Saving...
                    </>
                  ) : (
                    "Save Username"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-muted rounded-xl px-3 py-2.5">
              <p className="text-sm font-medium text-foreground">
                {displayName}
              </p>
            </div>
          )}
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full rounded-xl border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive font-semibold py-2.5"
            data-ocid="profile.delete_button"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground pt-2">
          &copy; {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
