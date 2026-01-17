"use client";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "@/components/ui/menubar";
import { TablePicker } from "@/components/ui/table-picker";
import { useEditorStore } from "@/store/use-editor-store";
import { OrganizationSwitcher, UserButton } from "@clerk/clerk-react";
import {
    Bold,
    FileCode,
    FileEdit,
    FileIcon,
    FileJson,
    FileText,
    FileType,
    FolderOpen,
    Italic,
    Printer,
    Redo,
    RemoveFormatting,
    Save,
    SaveAll,
    Strikethrough,
    Table,
    Trash2,
    Underline,
    Undo,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect } from "react";
import { Avatars } from "./avatars";
import { DocumentInput } from "./document-input";
import { Inbox } from "./inbox";

type NavbarProps = {
  onNewDocument?: () => void;
  onOpenDocument?: () => void;
  onSaveDocument?: () => void;
  onSaveAsDocument?: () => void;
  onRenameDocument?: () => void;
  onRemoveDocument?: () => void;
  onPrintDocument?: () => void;
  onInsertTable?: () => void;
  onBold?: () => void;
  onItalic?: () => void;
  onUnderline?: () => void;
  onStrikethrough?: () => void;
  onClearFormat?: () => void;
};

export default function Navbar({
  onNewDocument,
  onOpenDocument,
  onSaveDocument,
  onSaveAsDocument,
  onRenameDocument,
  onRemoveDocument,
  onPrintDocument,
  onInsertTable,
  onBold,
  onItalic,
  onUnderline,
  onStrikethrough,
  onClearFormat,
}: NavbarProps) {
  const { editor } = useEditorStore();

  // Helper function to download files
  const downloadFile = useCallback(
    (content: string, filename: string, mimeType: string) => {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    []
  );

  // File operations
  const handleNew = useCallback(() => {
    onNewDocument?.();
  }, [onNewDocument]);

  const handleOpen = useCallback(() => {
    onOpenDocument?.();
  }, [onOpenDocument]);

  const handleRename = useCallback(() => {
    onRenameDocument?.();
  }, [onRenameDocument]);

  const handleRemove = useCallback(() => {
    onRemoveDocument?.();
  }, [onRemoveDocument]);

  const handlePrint = useCallback(() => {
    if (onPrintDocument) {
      onPrintDocument();
    } else {
      window.print();
    }
  }, [onPrintDocument]);

  const handleSave = useCallback(() => {
    if (onSaveDocument) {
      onSaveDocument();
    } else {
      console.log("Save document");
    }
  }, [onSaveDocument]);

  const handleExport = useCallback(
    (format: "json" | "pdf" | "text" | "html") => {
      if (!editor) {
        console.warn("Editor not available for export");
        return;
      }

      // Only call onSaveAsDocument callback if provided
      onSaveAsDocument?.();

      try {
        switch (format) {
          case "json":
            const json = JSON.stringify(editor.getJSON(), null, 2);
            downloadFile(json, "document.json", "application/json");
            break;
          case "text":
            const text = editor.getText();
            downloadFile(text, "document.txt", "text/plain");
            break;
          case "html":
            const html = editor.getHTML();
            downloadFile(html, "document.html", "text/html");
            break;
          case "pdf":
            window.print();
            break;
        }
      } catch (error) {
        console.error("Export failed:", error);
      }
    },
    [editor, onSaveAsDocument, downloadFile]
  );

  // Edit operations
  const handleUndo = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().undo().run();
  }, [editor]);

  const handleRedo = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().redo().run();
  }, [editor]);

  // Insert operations
  const handleInsertTable = useCallback(
    (rows: number = 3, cols: number = 3) => {
      if (onInsertTable) {
        onInsertTable();
      } else if (editor) {
        editor
          .chain()
          .focus()
          .insertTable({ rows, cols, withHeaderRow: true })
          .run();
      }
    },
    [editor, onInsertTable]
  );

  // Format operations
  const handleBold = useCallback(() => {
    if (onBold) {
      onBold();
    } else if (editor) {
      editor.chain().focus().toggleBold().run();
    }
  }, [editor, onBold]);

  const handleItalic = useCallback(() => {
    if (onItalic) {
      onItalic();
    } else if (editor) {
      editor.chain().focus().toggleItalic().run();
    }
  }, [editor, onItalic]);

  const handleUnderline = useCallback(() => {
    if (onUnderline) {
      onUnderline();
    } else if (editor) {
      editor.chain().focus().toggleUnderline().run();
    }
  }, [editor, onUnderline]);

  const handleStrikethrough = useCallback(() => {
    if (onStrikethrough) {
      onStrikethrough();
    } else if (editor) {
      editor.chain().focus().toggleStrike().run();
    }
  }, [editor, onStrikethrough]);

  const handleClearFormat = useCallback(() => {
    if (onClearFormat) {
      onClearFormat();
    } else if (editor) {
      editor.chain().focus().clearNodes().unsetAllMarks().run();
    }
  }, [editor, onClearFormat]);

  // Check if undo/redo is available
  const canUndo = editor?.can().undo() ?? false;
  const canRedo = editor?.can().redo() ?? false;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = /mac/i.test(navigator.userAgent);
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (!modifier) return;

      switch (e.key.toLowerCase()) {
        case "n":
          e.preventDefault();
          handleNew();
          break;
        case "o":
          e.preventDefault();
          handleOpen();
          break;
        case "s":
          e.preventDefault();
          handleSave();
          break;
        case "p":
          e.preventDefault();
          handlePrint();
          break;
        case "z":
          if (!e.shiftKey) {
            e.preventDefault();
            handleUndo();
          }
          break;
        case "y":
          e.preventDefault();
          handleRedo();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNew, handleOpen, handleSave, handlePrint, handleUndo, handleRedo]);

  return (
    <nav
      className="flex items-center justify-between px-4 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      aria-label="Document navigation"
    >
      <div className="flex gap-3 items-center min-w-0 flex-1">
        <Link 
          href="/" 
          aria-label="Go to home"
          className="flex-shrink-0 transition-opacity hover:opacity-80"
        >
          <Image src="/logo.svg" alt="logo" width={40} height={43} priority />
        </Link>
        <div className="flex flex-col min-w-0 flex-1">
          <DocumentInput />
          <div className="flex items-center mt-0.5">
            <Menubar
              className="border-none bg-transparent shadow-none h-auto p-0"
              aria-label="Document menu"
            >
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-1.5 px-2 rounded-md hover:bg-muted/80 h-auto transition-colors">
                  File
                </MenubarTrigger>
                <MenubarContent className="print:hidden">
                  <MenubarItem onClick={handleNew} className="gap-2 cursor-pointer">
                    <FileIcon className="size-4" />
                    <span>New Document</span>
                    <MenubarShortcut>Ctrl+N</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem onClick={handleOpen} className="gap-2 cursor-pointer">
                    <FolderOpen className="size-4" />
                    <span>Open</span>
                    <MenubarShortcut>Ctrl+O</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem onClick={handleSave} className="gap-2 cursor-pointer">
                    <Save className="size-4" />
                    <span>Save</span>
                    <MenubarShortcut>Ctrl+S</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSub>
                    <MenubarSubTrigger className="gap-2">
                      <SaveAll className="size-4" />
                      <span>Save as</span>
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem
                        onClick={() => handleExport("json")}
                        className="gap-2 cursor-pointer"
                      >
                        <FileJson className="size-4" />
                        <span>JSON</span>
                      </MenubarItem>
                      <MenubarItem
                        onClick={() => handleExport("pdf")}
                        className="gap-2 cursor-pointer"
                      >
                        <FileType className="size-4" />
                        <span>PDF</span>
                      </MenubarItem>
                      <MenubarItem
                        onClick={() => handleExport("text")}
                        className="gap-2 cursor-pointer"
                      >
                        <FileText className="size-4" />
                        <span>Text</span>
                      </MenubarItem>
                      <MenubarItem
                        onClick={() => handleExport("html")}
                        className="gap-2 cursor-pointer"
                      >
                        <FileCode className="size-4" />
                        <span>HTML</span>
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarItem onClick={handleRename} className="gap-2 cursor-pointer">
                    <FileEdit className="size-4" />
                    <span>Rename</span>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem onClick={handlePrint} className="gap-2 cursor-pointer">
                    <Printer className="size-4" />
                    <span>Print</span>
                    <MenubarShortcut>Ctrl+P</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem onClick={handleRemove} className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                    <Trash2 className="size-4" />
                    <span>Remove</span>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-1.5 px-2 rounded-md hover:bg-muted/80 h-auto transition-colors">
                  Edit
                </MenubarTrigger>
                <MenubarContent className="print:hidden">
                  <MenubarItem
                    onClick={handleUndo}
                    disabled={!canUndo}
                    className="gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Undo className="size-4" />
                    <span>Undo</span>
                    <MenubarShortcut>Ctrl+Z</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem
                    onClick={handleRedo}
                    disabled={!canRedo}
                    className="gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Redo className="size-4" />
                    <span>Redo</span>
                    <MenubarShortcut>Ctrl+Y</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-1.5 px-2 rounded-md hover:bg-muted/80 h-auto transition-colors">
                  Insert
                </MenubarTrigger>
                <MenubarContent className="print:hidden">
                  <MenubarSub>
                    <MenubarSubTrigger className="gap-2">
                      <Table className="size-4" />
                      <span>Table</span>
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <TablePicker onSelect={handleInsertTable} />
                    </MenubarSubContent>
                  </MenubarSub>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-1.5 px-2 rounded-md hover:bg-muted/80 h-auto transition-colors">
                  Format
                </MenubarTrigger>
                <MenubarContent className="print:hidden">
                  <MenubarItem onClick={handleBold} className="gap-2 cursor-pointer">
                    <Bold className="size-4" />
                    <span>Bold</span>
                    <MenubarShortcut>Ctrl+B</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem onClick={handleItalic} className="gap-2 cursor-pointer">
                    <Italic className="size-4" />
                    <span>Italic</span>
                    <MenubarShortcut>Ctrl+I</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem onClick={handleUnderline} className="gap-2 cursor-pointer">
                    <Underline className="size-4" />
                    <span>Underline</span>
                    <MenubarShortcut>Ctrl+U</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem onClick={handleStrikethrough} className="gap-2 cursor-pointer">
                    <Strikethrough className="size-4" />
                    <span>Strikethrough</span>
                    <MenubarShortcut>Ctrl+Shift+X</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem onClick={handleClearFormat} className="gap-2 cursor-pointer">
                    <RemoveFormatting className="size-4" />
                    <span>Clear Format</span>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 pl-4 flex-shrink-0">
        <div className="hidden sm:flex items-center gap-2">
          <Avatars />
        </div>
        <Inbox />
        <div className="hidden md:block">
          <OrganizationSwitcher
            afterCreateOrganizationUrl="/"
            afterLeaveOrganizationUrl="/"
            afterSelectOrganizationUrl="/"
            afterSelectPersonalUrl="/"
          />
        </div>
        <UserButton />
      </div>
    </nav>
  );
}
