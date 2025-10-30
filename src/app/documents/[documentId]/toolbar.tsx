'use client'


import { Separator } from "@radix-ui/react-separator";
import { useEffect, useState } from "react";
import ToolbarButtons from "./toolbar/ToolbarButtons";
import HeadingLevelButtons from "./toolbar/HeadingLevelButtons";
import FontFamilyButtons from "./toolbar/FontFamilyButtons";
import AlignButton from "./toolbar/AlignButton";
import ListButton from "./toolbar/ListButton";
import FontSizeButton from "./toolbar/FontSizeButton";
import ImageButton from "./toolbar/ImageButton";
import LinkButton from "./toolbar/LinkButton";
import TextColorButtons from "./toolbar/TextColorButtons";
import { ListTodoIcon, RemoveFormattingIcon, MessageSquareIcon, UndoIcon, RedoIcon, PrinterIcon, SpellCheckIcon, BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react";
import { useEditorStore } from "@/store/use-editor-store";

const Toolbar = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
    const { editor } = useEditorStore();
    if (!isMounted) {
        return (
            <div className="bg-[#f1f4f9] px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex items-center gap-x-0.5 overflow-x-auto">
                <div className="h-7 w-full animate-pulse bg-neutral-200/50 rounded" />
            </div>
        );
    }
    return (
        <div className="bg-[#f1f4f9] px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex items-center gap-x-0.5 overflow-x-auto">
            {/* Document actions */}
            <div className="flex items-center gap-x-0.5">
                <ToolbarButtons icon={UndoIcon} onClick={() => editor?.chain().focus().undo().run()} isActive={false}/>
                <ToolbarButtons icon={RedoIcon} onClick={() => editor?.chain().focus().redo().run()} isActive={false}/>
                <ToolbarButtons icon={PrinterIcon} onClick={() => window.print()} isActive={false}/>
                <ToolbarButtons icon={SpellCheckIcon} onClick={() => {
                    const current = editor?.view.dom.getAttribute("spellcheck")
                    editor?.view.dom.setAttribute("spellcheck", current === 'false' ? "true" : "false")
                }} isActive={false}/>
            </div>
            <Separator orientation="vertical" className="h-6 bg-neutral-300 w-px mx-0.5" />
            {/* Text structure */}
            <HeadingLevelButtons />
            <Separator orientation="vertical" className="h-6 bg-neutral-300 w-px mx-0.5" />
            <FontFamilyButtons />
            <Separator orientation="vertical" className="h-6 bg-neutral-300 w-px mx-0.5" />
            {/* Text formatting */}
            <div className="flex items-center gap-x-0.5">
                <ToolbarButtons icon={BoldIcon} onClick={() => editor?.chain().focus().toggleBold().run()} isActive={editor?.isActive('bold')}/>
                <ToolbarButtons icon={ItalicIcon} onClick={() => editor?.chain().focus().toggleItalic().run()} isActive={editor?.isActive('italic')}/>
                <ToolbarButtons icon={UnderlineIcon} onClick={() => editor?.chain().focus().toggleUnderline().run()} isActive={editor?.isActive('underline')}/>
            </div>
            <Separator orientation="vertical" className="h-6 bg-neutral-300 w-px mx-0.5" />
            {/* Text color */}
            <TextColorButtons />
            <Separator orientation="vertical" className="h-6 bg-neutral-300 w-px mx-0.5" />
            {/* Alignment */}
            <AlignButton />
            <Separator orientation="vertical" className="h-6 bg-neutral-300 w-px mx-0.5" />
            {/* Font Size */}
            <FontSizeButton />
            <Separator orientation="vertical" className="h-6 bg-neutral-300 w-px mx-0.5" />
            {/* Lists */}
            <div className="flex items-center gap-x-0.5">
                <ListButton />
                <ToolbarButtons icon={ListTodoIcon} onClick={() => editor?.chain().focus().toggleTaskList().run()} isActive={editor?.isActive('taskList')}/>
            </div>
            <Separator orientation="vertical" className="h-6 bg-neutral-300 w-px mx-0.5" />
            {/* Insert media */}
            <div className="flex items-center gap-x-0.5">
                <LinkButton />
                <ImageButton />
            </div>
            <Separator orientation="vertical" className="h-6 bg-neutral-300 w-px mx-0.5" />
            {/* Additional actions */}
            <div className="flex items-center gap-x-0.5">
                <ToolbarButtons icon={RemoveFormattingIcon} onClick={() => editor?.chain().focus().unsetAllMarks().run()} isActive={false}/>
                <ToolbarButtons icon={MessageSquareIcon} onClick={() => console.log("comment")} isActive={false}/>
            </div>
        </div>
    )
}

export default Toolbar;