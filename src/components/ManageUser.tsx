"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useRoom } from "@liveblocks/react/suspense";
import {
  getRoomMembers,
  removeUserFromRoom,
  updateUserRole,
} from "../../actions/roomActions";

type Member = {
  id: string;
  name: string | null;
  email: string;
  role: "read" | "edit";
};

export default function ManageUser() {
  const room = useRoom();
  const [members, setMembers] = useState<Member[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      getRoomMembers(room.id).then((res) => {
        setIsOwner(res.isOwner);
        setOwnerId(res.ownerId);
        setMembers(res.members);
      });
    });
  }, [open, room.id]);

  const onRoleChange = (userId: string, newRole: "read" | "edit") => {
    startTransition(() => {
      updateUserRole(room.id, userId, newRole).then(() => {
        setMembers((prev) =>
          prev.map((m) => (m.id === userId ? { ...m, role: newRole } : m))
        );
      });
    });
  };

  const onRemove = (userId: string) => {
    if (!confirm("Are you sure you want to remove this user?")) return;

    startTransition(() => {
      removeUserFromRoom(room.id, userId).then(() => {
        setMembers((prev) => prev.filter((m) => m.id !== userId));
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button asChild variant="outline">
        <DialogTrigger>Users</DialogTrigger>
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage collaborators</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[300px] overflow-y-auto">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between border p-2 rounded"
            >
              <div className="flex flex-col">
                <span className="font-medium">
                  {member.name || member.email}
                </span>
                <span className="text-sm text-gray-500">
                  {member.id === ownerId
                    ? "Owner"
                    : member.role === "edit"
                    ? "Editor"
                    : "Viewer"}
                </span>
              </div>

              {isOwner && member.id !== ownerId && (
                <div className="flex items-center gap-2">
                  <Select
                    value={member.role}
                    onValueChange={(v) =>
                      onRoleChange(member.id, v as "read" | "edit")
                    }
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="edit">Editor</SelectItem>
                      <SelectItem value="read">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onRemove(member.id)}
                    disabled={pending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
