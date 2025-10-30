import { cn } from "@/lib/utils";
import { ToolbarButtonsProps } from "./types";

export const ToolbarButton = ({ onClick, icon: Icon, isActive }: ToolbarButtonsProps) => {
    return (
        <button onClick={onClick} className={cn(
            "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80",
            isActive && "bg-neutral-200/80"
        )}>
            <Icon className="size-4" />
        </button>
    )
}
