import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { CirclePicker, ColorResult } from "react-color";
import { useEditorStore } from "@/store/use-editor-store";

const TextColorButtons = () => {
    const { editor } = useEditorStore();
    const value = editor?.getAttributes('textStyle').color || '#000000';
    const onChange = (color: ColorResult) => {
        editor?.chain().focus().setColor(color.hex).run();
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden gap-0.5">
                    <span className="text-sm font-bold leading-none" style={{ color: value }}>A</span>
                    <div className="h-1 w-full rounded-sm" style={{ backgroundColor: value }}></div>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2.5 bg-white shadow-lg border border-neutral-200 rounded-md">
                <CirclePicker color={value} onChange={onChange} />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default TextColorButtons;

