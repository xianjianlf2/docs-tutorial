import { useState } from "react";
import { useEditorStore } from "@/store/use-editor-store";
import { ImageIcon, UploadIcon, SearchIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { Dialog, DialogContent, DialogTitle, DialogOverlay, DialogPortal } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";

const ImageButton = () => {
    const { editor } = useEditorStore();
    const [imageUrl, setImageUrl] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const onChange = (url: string) => {
        editor?.chain().focus().setImage({ src: url }).run();
        setImageUrl('');
        setIsDialogOpen(false);
    }
    const onUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const url = URL.createObjectURL(file);
                onChange(url);
            }
        }
        input.click();
    }
    const handleImageUrlSubmit = () => {
        if (imageUrl.trim()) {
            onChange(imageUrl);
            setIsDialogOpen(false);
            setImageUrl('');
        }
    }
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="h-7 min-w-7 shrink-0 flex items-center justify-between rounded-sm hover:bg-neutral-200/80 px-2 text-sm">
                        <ImageIcon className="size-4" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-2.5 flex flex-col gap-y-2 bg-white shadow-lg border border-neutral-200 rounded-md">
                    <button
                        onClick={onUpload}
                        className="flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80"
                    >
                        <UploadIcon className="size-4" />
                        <span className="text-sm">Upload Image</span>
                    </button>
                    <button
                        onClick={() => setIsDialogOpen(true)}
                        className="flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80"
                    >
                        <SearchIcon className="size-4" />
                        <span className="text-sm">Paste Image URL</span>
                    </button>
                </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogPortal>
                    <DialogOverlay className="fixed inset-0 bg-black/50 z-40" />
                    <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg border border-neutral-200 max-w-md w-full z-50">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-semibold mb-4">Insert Image URL</DialogTitle>
                        </DialogHeader>
                        <Input placeholder="Insert Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleImageUrlSubmit();
                                }
                            }}
                        />
                        <DialogFooter className="mt-4 flex justify-end gap-2">
                            <Button onClick={handleImageUrlSubmit}>Insert</Button>
                        </DialogFooter>
                    </DialogContent>
                </DialogPortal>
            </Dialog>
        </>
    )
}

export default ImageButton;

