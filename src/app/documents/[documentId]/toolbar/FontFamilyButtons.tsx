import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";

const FontFamilyButtons = () => {
    const { editor } = useEditorStore();
    const fonts = [
        { label: "Arial", value: "Arial" },
        { label: "Times New Roman", value: "Times New Roman" },
        { label: "Verdana", value: "Verdana" },
        { label: "Courier New", value: "Courier New" },
        { label: "Georgia", value: "Georgia" },
        { label: "Garamond", value: "Garamond" },
        { label: "Palatino", value: "Palatino" },
        { label: "Bookman", value: "Bookman" },
        { label: "Comic Sans MS", value: "Comic Sans MS" },
    ]
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-7 min-w-[120px] shrink-0 flex items-center justify-between rounded-sm hover:bg-neutral-200/80 px-2 text-sm">
                    <span className="truncate">{editor?.getAttributes('textStyle').fontFamily || 'Arial'}</span>
                    <ChevronDownIcon className="size-4 ml-2 shrink-0" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-1 flex flex-col gap-y-1 bg-white shadow-lg border border-neutral-200 rounded-md">
                {fonts.map(({ label, value }) => (
                    <button key={value} className={cn(
                        "flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-neutral-200/80 text-left min-w-[200px]",
                        editor?.getAttributes('textStyle').fontFamily === value && "bg-neutral-200/80"
                    )}
                        style={{ fontFamily: value }}
                        onClick={() => {
                            editor?.chain().focus().setFontFamily(value as string).run();
                        }}>
                        <span className="text-sm">{label}</span>
                    </button>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default FontFamilyButtons;

