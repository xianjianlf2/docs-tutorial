import { cn } from "@/lib/utils";
import { Spinner } from "./ui/spinner";

interface FullscreenLoaderProps {
    label?: string;
    className?: string;
}

export const FullscreenLoader: React.FC<FullscreenLoaderProps> = ({ label, className }) => {
    return (
        <div 
            className={cn(
                "fixed inset-0 z-50 flex flex-col items-center justify-center",
                "bg-background/80 backdrop-blur-sm",
                "animate-in fade-in-0 duration-200",
                className
            )}
        >
            <div className="flex flex-col items-center gap-4">
                <Spinner className="size-8 text-primary" />
                {label && (
                    <p className="text-sm font-medium text-muted-foreground animate-pulse">
                        {label}
                    </p>
                )}
            </div>
        </div>
    );
};