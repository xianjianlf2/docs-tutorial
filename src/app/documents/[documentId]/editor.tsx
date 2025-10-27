'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Table from '@tiptap/extension-table'
import Text from '@tiptap/extension-text'
import Document from '@tiptap/extension-document'
import Gapcursor from '@tiptap/extension-gapcursor'
import Paragraph from '@tiptap/extension-paragraph'
import Image from '@tiptap/extension-image'

const Editor = () => {
    const editor = useEditor({
        extensions: [StarterKit, TaskList, TaskItem.configure({
            nested: true,
        }), Document,
            Paragraph,
            Text,
            Gapcursor,
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            Image],
        content: `
          <p>This is a basic example of implementing images. Drag to re-order.</p>
        <img src="https://placehold.co/800x400" />
        <img src="https://placehold.co/800x400/6A00F5/white" />
      `,
        editorProps: {
            attributes: {
                style: 'padding-left: 56px;padding-right:56px;',
                class: 'focus:outline-none print:border-0 bg-white border-[#c7c7c7] border flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text',
            },
        },
        // Don't render immediately on the server to avoid SSR issues
        immediatelyRender: false,
    })
    return (
        <div className='size-full overflow-x-auto bg-[#f9fbfd] px-4 print:p-0 print:bg-white print:overflow-visible'>
            <div className='min-w-max justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0'>
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}

export default Editor;