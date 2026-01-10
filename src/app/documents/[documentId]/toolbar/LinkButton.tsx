import { useState } from "react";
import { useEditorStore } from "@/store/use-editor-store";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { Link2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LinkButton = () => {
    const { editor } = useEditorStore();
    const [value, setValue] = useState('');
    
    const onChange = (href: string) => {
        if (!editor) return;
        editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
        setValue("");
    }
    
    return (
        <DropdownMenu onOpenChange={(open) => {
            if (open && editor) {
                const linkAttrs = editor.getAttributes('link');
                setValue(linkAttrs.href || '');
            }
        }}>
            <DropdownMenuTrigger asChild>
                <button 
                    className="h-7 min-w-7 shrink-0 flex items-center justify-between rounded-sm hover:bg-neutral-200/80 px-2 text-sm"
                    aria-label="Insert link"
                >
                    <Link2Icon className="size-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2.5 flex items-center gap-x-2 bg-white shadow-lg border border-neutral-200 rounded-md">
                <Input 
                    placeholder="Paste link" 
                    value={value} 
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onChange(value);
                        }
                    }}
                />
                <Button onClick={() => onChange(value)}>Apply</Button>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default LinkButton;