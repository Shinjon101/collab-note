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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MailPlus } from "lucide-react";
import { inviteUser } from "../../actions/inviteUser";
import { useState, useTransition } from "react";

export default function InviteUserButton({ docId }: { docId: string }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"read" | "edit">("edit");
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const submit = () =>
    start(async () => {
      setMsg(null);
      const res = await inviteUser(docId, email.trim(), role);
      if (!res.ok) {
        setMsg(res.error);
        return;
      }
      setEmail("");
    });

  return (
    <Dialog>
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
        <div className="flex justify-between gap-5">
          <Input
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={pending}
          />
          <Select onValueChange={(v) => setRole(v as "read" | "edit")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Editor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="edit">Editor</SelectItem>
              <SelectItem value="read">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {msg && <p className="text-red-500 text-sm mt-2">{msg}</p>}

        <DialogFooter className="flex justify-start">
          <Button disabled={pending} onClick={submit}>
            {pending ? "Adding…" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
