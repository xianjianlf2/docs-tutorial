'use client'


import { cn } from "@/lib/utils";
import { BoldIcon, ChevronDownIcon, ItalicIcon, ListTodoIcon, LucideIcon, MessageSquareIcon, PrinterIcon, RedoIcon, RemoveFormattingIcon, SpellCheckIcon, UnderlineIcon, UndoIcon } from "lucide-react";
import { useEditorStore } from "@/store/use-editor-store";
import { Separator } from "@radix-ui/react-separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Level } from "@tiptap/extension-heading";
interface ToolbarButtonsProps {
    onClick: () => void;
    icon: LucideIcon;
    isActive?: boolean;
}
const ToolbarButtons = ({ onClick, icon: Icon, isActive }: ToolbarButtonsProps) => {
    return (
        <button onClick={onClick} className={cn(
            "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80",
            isActive && "bg-neutral-200/80"
        )}>
            <Icon className="size-4" />
        </button>
    )

}


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
            <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
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
            <DropdownMenuTrigger>
                <button className="h-7 w-min-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 overflow-hidden text-sm">
                    <span className="truncate">{editor?.getAttributes('textStyle').fontFamily || 'Arial'}</span>
                    <ChevronDownIcon className="size-4 ml-2 shrink-0" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
                {fonts.map(({ label, value }) => (
                    <button key={value} className={cn(
                        "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80",
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
const Toolbar = () => {

    const { editor } = useEditorStore();
    const sections: {
        label: string;
        icon: LucideIcon;
        onClick: () => void;
        isActive?: boolean;
    }[][] = [[
        {
            label: "Undo",
            icon: UndoIcon,
            onClick: () => {
                editor?.chain().focus().undo().run();
            },
            isActive: false,
        },
        {
            label: "Redo",
            icon: RedoIcon,
            onClick: () => {
                editor?.chain().focus().redo().run();
            },
            isActive: false,
        }, {
            label: "Print",
            icon: PrinterIcon,
            onClick: () => {
                window.print();
            },
            isActive: false,
        },
        // spell check
        {
            label: "Spell Check",
            icon: SpellCheckIcon,
            onClick: () => {
                const current = editor?.view.dom.getAttribute("spellcheck")
                editor?.view.dom.setAttribute("spellcheck", current === 'false' ? "true" : "false")
            },
            isActive: false,
        }
    ],
    [
        {
            label: "Bold",
            icon: BoldIcon,
            onClick: () => {
                editor?.chain().focus().toggleBold().run();
            },
            isActive: editor?.isActive('bold'),
        },
        {
            label: "Italic",
            icon: ItalicIcon,
            onClick: () => {
                editor?.chain().focus().toggleItalic().run();
            },
            isActive: editor?.isActive('italic'),
        },
        {
            label: "Underline",
            icon: UnderlineIcon,
            onClick: () => {
                editor?.chain().focus().toggleUnderline().run();
            },
            isActive: editor?.isActive('underline'),
        }
    ], [
        {
            label: "Comment",
            icon: MessageSquareIcon,
            onClick: () => {
                console.log("comment");
            },
            isActive: false,
        }, {
            label: "List Todo",
            icon: ListTodoIcon,
            onClick: () => {
                editor?.chain().focus().toggleTaskList().run();
            },
            isActive: false,
        }, {
            label: "Remove Formatting",
            icon: RemoveFormattingIcon,
            onClick: () => {
                editor?.chain().focus().unsetAllMarks().run();
            },
            isActive: false,
        }
    ]]
    return (
        <div className="bg-[#f1f4f9] px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex items-center gap-x-0.5 overflow-x-auto">
            {sections[0].map((item) => (
                <ToolbarButtons key={item.label} {...item} />
            ))}
            <Separator orientation="vertical" className="h-6 bg-neutral-300" />
            <HeadingLevelButtons />
            <Separator orientation="vertical" className="h-6 bg-neutral-300" />
            <FontFamilyButtons />
            <Separator orientation="vertical" className="h-6 bg-neutral-300" />
            {sections[1].map((item) => (
                <ToolbarButtons key={item.label} {...item} />
            ))}
            <Separator orientation="vertical" className="h-6 bg-neutral-300" />
            {sections[2].map((item) => (
                <ToolbarButtons key={item.label} {...item} />
            ))}
            <Separator orientation="vertical" className="h-6 bg-neutral-300" />

        </div>
    )
}

export default Toolbar;