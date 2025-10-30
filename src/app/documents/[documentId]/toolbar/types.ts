import { LucideIcon } from "lucide-react";

export interface ToolbarButtonsProps {
    onClick: () => void;
    icon: LucideIcon;
    isActive?: boolean;
}
