"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface RenameDialogProps {
  documentId: Id<"documents">;
  title: string;
  children: React.ReactNode;
}

export const RenameDialog = ({
  documentId,
  title,
  children,
}: RenameDialogProps) => {
  const updateDocument = useMutation(api.documents.updateById);
  const [isOpen, setIsOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || newTitle === title || isSaving) {
      return;
    }

    setIsSaving(true);
    try {
      await updateDocument({
        id: documentId,
        title: newTitle.trim(),
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to rename document:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setNewTitle(title);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
        {children}
      </DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>重命名文档</DialogTitle>
          <DialogDescription>
            为文档输入一个新名称。
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSave}>
          <div className="my-4">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="文档名称"
              disabled={isSaving}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSaving}
            >
              取消
            </Button>
            <Button type="submit" disabled={isSaving || !newTitle.trim()}>
              {isSaving ? "保存中..." : "保存"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
