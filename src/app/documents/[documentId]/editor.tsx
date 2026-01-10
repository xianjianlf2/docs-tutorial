'use client'
import { FontSizeExtension } from '@/extensions/font-size'
import { LineHeightExtension } from '@/extensions/line-height'
import { useEditorStore } from '@/store/use-editor-store'
import { Editor as TiptapEditor } from '@tiptap/core'
import { Color } from '@tiptap/extension-color'
import { FontFamily } from '@tiptap/extension-font-family'
import { Highlight } from '@tiptap/extension-highlight'
import { Link } from '@tiptap/extension-link'
import { Table } from '@tiptap/extension-table'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableRow } from '@tiptap/extension-table-row'
import { TaskItem } from '@tiptap/extension-task-item'
import { TaskList } from '@tiptap/extension-task-list'
import { TextAlign } from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { Underline } from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { useCallback } from 'react'
import ImageResize from 'tiptap-extension-resize-image'
import Ruler from './toolbar/Ruler'

const Editor = () => {
    const { setEditor } = useEditorStore();
    
    // 使用 useCallback 优化回调函数
    const handleEditorUpdate = useCallback((editor: TiptapEditor) => {
        setEditor(editor);
    }, [setEditor]);

    const editor = useEditor({
        onCreate({ editor }) {
            handleEditorUpdate(editor);
        },
        onDestroy() {
            setEditor(null);
        },
        onUpdate({ editor }) {
            handleEditorUpdate(editor);
        },
        onSelectionUpdate({ editor }) {
            handleEditorUpdate(editor);
        },
        onTransaction({ editor }) {
            handleEditorUpdate(editor);
        },
        onFocus({ editor }) {
            handleEditorUpdate(editor);
        },
        onBlur({ editor }) {
            handleEditorUpdate(editor);
        },
        onContentError({ editor }) {
            handleEditorUpdate(editor);
        },
        extensions: [
            StarterKit,
            TaskList.configure({
                itemTypeName: 'taskItem',
            }),
            TaskItem.configure({
                nested: true,
            }),
            Table.configure({
                resizable: true,
                handleWidth: 5,
                cellMinWidth: 25,
            }),
            TableRow,
            TableHeader,
            TableCell,
            ImageResize,
            Underline,
            TextStyle,
            FontFamily.configure({
                types: ['textStyle'],
            }),
            Color.configure({
                types: ['textStyle'],
            }),
            Highlight.configure({
                multicolor: true,
            }),
            Link.configure({
                openOnClick: false,
                defaultProtocol: 'https',
                autolink: true,
                HTMLAttributes: {
                    class: 'cursor-pointer underline text-blue-600',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['left', 'center', 'right', 'justify'],
                defaultAlignment: 'left',
            }),
            FontSizeExtension,
            LineHeightExtension.configure({
                types: ['heading', 'paragraph'],
                defaultLineHeight: 'normal',
            })
        ],
        content: '',
        editorProps: {
            attributes: {
                style: 'padding-left: 56px;padding-right:56px;',
                class: 'focus:outline-none print:border-0 bg-white border-[#c7c7c7] border flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text',
            },
        },
        // 使用最新 API 配置
        immediatelyRender: false,
        shouldRerenderOnTransaction: false,
    })
    return (
        <div className='size-full overflow-x-auto bg-[#f9fbfd] px-4 print:p-0 print:bg-white print:overflow-visible'>
            <Ruler />
            <div className='min-w-max justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0'>
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}

export default Editor;