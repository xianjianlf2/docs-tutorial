import { useEditorStore } from "@/store/use-editor-store";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { MinusIcon, PlusIcon, ChevronDownIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const commonFontSizes = [12, 14, 16, 18, 20, 24, 32];

const FontSizeButton = () => {
    const { editor } = useEditorStore();
    const fontSizeRaw = editor?.getAttributes('textStyle').fontSize;
    
    let currentFontSize = '16';
    if (typeof fontSizeRaw === 'string' && fontSizeRaw.endsWith('px')) {
        currentFontSize = fontSizeRaw.replace('px', '');
    } else if (!!fontSizeRaw && typeof fontSizeRaw === 'number') {
        currentFontSize = fontSizeRaw.toString();
    }
    
    const [inputValue, setInputValue] = useState(currentFontSize);

    useEffect(() => {
        setInputValue(currentFontSize)
    }, [currentFontSize])
    
    // 更新字号逻辑
    const updateFontSize = (newSize: string) => {
        const size = parseInt(newSize);
        if (!isNaN(size) && size > 0 && editor) {
            editor.chain().focus().setFontSize(`${size}px`).run();
        }
    }
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }
    
    const handleInputBlur = () => {
        updateFontSize(inputValue)
    }
    
    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            updateFontSize(inputValue)
            editor?.commands.focus()
        }
    }
    
    // 左右按钮逻辑
    const incrementFontSize = () => {
        const size = parseInt(currentFontSize) + 1;
        updateFontSize(size.toString())
    }
    
    const decrementFontSize = () => {
        const size = Math.max(1, parseInt(currentFontSize) - 1);
        updateFontSize(size.toString())
    }
    
    return (
        <div className="flex items-center gap-0.5">
            <button
                onClick={decrementFontSize}
                className="h-7 min-w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5"
                aria-label="Decrease font size"
            >
                <MinusIcon className="size-4" />
            </button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="h-7 min-w-[70px] shrink-0 flex items-center justify-between rounded-sm hover:bg-neutral-200/80 px-2 text-sm">
                        <span className="truncate mr-1">{currentFontSize}px</span>
                        <ChevronDownIcon className="size-4 ml-1" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-2 bg-white shadow-lg border border-neutral-200 rounded-md min-w-[120px] flex flex-col gap-2">
                    <Input
                        className="h-7 w-full px-2 text-center"
                        type="number"
                        min={1}
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        onKeyDown={handleInputKeyDown}
                    />
                    <div className="flex flex-wrap gap-1 justify-between mt-2">
                        {commonFontSizes.map(num => (
                            <Button
                                key={num}
                                className={cn(
                                    "h-7 px-2 min-w-0 flex-1 text-xs",
                                    currentFontSize === num.toString() && 'bg-neutral-200/80'
                                )}
                                variant="outline"
                                onClick={() => updateFontSize(num.toString())}
                            >
                                {num}px
                            </Button>
                        ))}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
            <button
                onClick={incrementFontSize}
                className="h-7 min-w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5"
                aria-label="Increase font size"
            >
                <PlusIcon className="size-4" />
            </button>
        </div>
    )
}

export default FontSizeButton;