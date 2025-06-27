"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MailPlus } from "lucide-react";
import { inviteUser } from "../../actions/inviteUser";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function InviteUserButton({ docId }: { docId: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"read" | "edit" | "">(""); // "" = not chosen
  const [pending, start] = useTransition();

  const clear = () => {
    setEmail("");
    setRole("");
  };

  const submit = () =>
    start(async () => {
      // Basic validation
      if (!email.trim() || !email.includes("@")) {
        toast.error("Please enter a valid e-mail address");
        return;
      }
      if (role === "") {
        toast.error("Please select a role");
        return;
      }

      const res = await inviteUser(docId, email.trim(), role);
      if (!res.ok) {
        toast.error(res.error ?? "Error inviting user");
        return;
      }

      toast.success("User invited!");
      clear();
      setOpen(false); // close dialog
    });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button asChild variant="outline">
        <DialogTrigger>
          <MailPlus className="mr-2 h-4 w-4" />
          Invite
        </DialogTrigger>
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add collaborator</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={pending}
          />

          <Select
            value={role}
            onValueChange={(v) => setRole(v as "read" | "edit")}
            disabled={pending}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="edit">Editor</SelectItem>
              <SelectItem value="read">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="flex justify-start">
          <Button onClick={submit} disabled={pending || role === ""}>
            {pending ? "Adding…" : "Add"}
          </Button>
          <DialogClose asChild>
            <Button variant="secondary" disabled={pending}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
