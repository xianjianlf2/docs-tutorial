import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";
import { Level } from "@tiptap/extension-heading";

const HeadingLevelButtons = () => {
    const { editor } = useEditorStore();
    const headings = [
        { label: "Normal text", value: 0, fontSize: '16px' },
        { label: "Heading 1", value: 1, fontSize: '32px' },
        { label: "Heading 2", value: 2, fontSize: '24px' },
        { label: "Heading 3", value: 3, fontSize: '20px' },
        { label: "Heading 4", value: 4, fontSize: '18px' },
        { label: "Heading 5", value: 5, fontSize: '16px' },
    ]
    const getCurrentHeading = () => {
        for (let level = 1; level <= 5; level++) {
            if (editor?.isActive('heading', { level })) {
                return `Heading ${level}`;
            }
        }
        return "Normal text";
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-7 min-w-[120px] shrink-0 flex items-center justify-between rounded-sm hover:bg-neutral-200/80 px-2 text-sm">
                    <span className="truncate">{getCurrentHeading()}</span>
                    <ChevronDownIcon className="size-4 ml-2 shrink-0" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-1 flex flex-col gap-y-1 bg-white shadow-lg border border-neutral-200 rounded-md">
                {headings.map(({ label, value, fontSize }) => (
                    <button
                        key={value}
                        className={cn(
                            "flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-neutral-200/80 text-left min-w-[200px]",
                            (value === 0 && !editor?.isActive('heading')) && "bg-neutral-200/80",
                            (value > 0 && editor?.isActive('heading', { level: value as Level })) && "bg-neutral-200/80"
                        )}
                        style={{ fontSize }}
                        onClick={() => {
                            if (value === 0) {
                                editor?.chain().focus().setParagraph().run();
                            } else {
                                editor?.chain().focus().toggleHeading({ level: value as Level }).run();
                            }
                        }}
                    >
                        <span>{label}</span>
                    </button>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default HeadingLevelButtons;

