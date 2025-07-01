"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
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
import { toast } from "sonner";

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
  const [openConfirm, setOpenConfirm] = useState(false);

  //fetch roster each time dialog opens
  useEffect(() => {
    startTransition(async () => {
      try {
        const res = await getRoomMembers(room.id);
        setIsOwner(res.isOwner);
        setOwnerId(res.ownerId);
        setMembers(res.members);
      } catch (_err) {
        toast.error("Unable to load members");
      }
    });
  }, [open, room.id]);

  //change role
  const onRoleChange = (userId: string, newRole: "read" | "edit") => {
    startTransition(async () => {
      try {
        await updateUserRole(room.id, userId, newRole);
        toast.success("Role updated");
        setMembers((prev) =>
          prev.map((m) => (m.id === userId ? { ...m, role: newRole } : m))
        );
      } catch (_err) {
        toast.error("Failed to update role");
      }
    });
  };

  // remove user
  const onRemove = (userId: string) => {
    startTransition(async () => {
      try {
        await removeUserFromRoom(room.id, userId);
        setOpenConfirm(false);
        toast.success("User removed");
        setMembers((prev) => prev.filter((m) => m.id !== userId));
      } catch (_err) {
        toast.error("Failed to remove user");
      }
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
                    disabled={pending}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="edit">Editor</SelectItem>
                      <SelectItem value="read">Viewer</SelectItem>
                    </SelectContent>
                  </Select>

                  <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
                    <Button asChild variant="destructive" size="icon">
                      <DialogTrigger>
                        <Trash2 className="h-4 w-4" />
                      </DialogTrigger>
                    </Button>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Remove this user</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to remove this user ?
                        </DialogDescription>
                      </DialogHeader>

                      <DialogFooter className="sm:justify-end gap-2">
                        <Button
                          variant="destructive"
                          onClick={() => onRemove(member.id)}
                          disabled={pending}
                        >
                          {pending ? "Removing..." : "Remove"}
                        </Button>

                        <DialogClose asChild>
                          <Button type="button" variant="secondary">
                            Cancel
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
