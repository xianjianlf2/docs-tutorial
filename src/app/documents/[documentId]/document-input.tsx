import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMutation } from "convex/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BsCloudCheck, BsCloudSlash } from "react-icons/bs";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface DocumentInputProps {
  title: string;
  id: Id<"documents">;
}

export const DocumentInput = ({ title, id }: DocumentInputProps) => {
  const [value, setValue] = useState(title);
  const [isPending, setIsPending] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const mutate = useMutation(api.documents.updateById);

  // Sync external title changes
  useEffect(() => {
    setValue(title);
  }, [title]);

  // Save function - only called on blur or Enter key
  const saveTitle = useCallback(
    async (newTitle: string) => {
      const trimmedTitle = newTitle.trim();
      
      // Validate title is valid and has changed
      if (!trimmedTitle || trimmedTitle === title) {
        return;
      }

      setIsPending(true);
      try {
        await mutate({
          id,
          title: trimmedTitle,
        });
        toast.success("Document title updated");
      } catch (error) {
        console.error("Failed to update document:", error);
        toast.error("Failed to update document title");
        // Restore original title on failure
        setValue(title);
      } finally {
        setIsPending(false);
      }
    },
    [id, mutate, title]
  );

  // Submit form or finish editing
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      const trimmedValue = value.trim();

      // If no input or no change, exit edit mode
      if (!trimmedValue || trimmedValue === title) {
        setIsEditing(false);
        setValue(title);
        return;
      }

      // Avoid duplicate saves
      if (isPending) {
        return;
      }

      // Save immediately (no debounce)
      await saveTitle(value);
      setIsEditing(false);
    },
    [value, title, isPending, saveTitle]
  );

  // Start editing
  const handleStartEdit = useCallback(() => {
    setIsEditing(true);
    // Use setTimeout to ensure state update before focusing
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  }, []);

  // Submit on blur
  const handleBlur = useCallback(() => {
    if (!isPending) {
      handleSubmit();
    }
  }, [isPending, handleSubmit]);

  // Keyboard event handling
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsEditing(false);
        setValue(title);
        inputRef.current?.blur();
      }
    },
    [title]
  );

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <form
          onSubmit={handleSubmit}
          className="relative w-fit max-w-[50ch]"
        >
          <span className="invisible whitespace-pre px-1.5 text-lg font-medium">
            {value || " "}
          </span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            disabled={isPending}
            className="absolute inset-0 text-lg font-medium text-foreground px-1.5 bg-transparent truncate border-b-2 border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Enter document title..."
            maxLength={100}
          />
        </form>
      ) : (
        <span
          onClick={handleStartEdit}
          className="text-lg font-medium px-1.5 cursor-pointer truncate hover:bg-muted/50 rounded transition-colors"
          title="Click to edit title"
        >
          {title}
        </span>
      )}
      <TooltipProvider>
        {isPending ? (
          <BsCloudSlash className="size-4 text-muted-foreground animate-pulse" />
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <BsCloudCheck className="size-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Synced to cloud</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
};
