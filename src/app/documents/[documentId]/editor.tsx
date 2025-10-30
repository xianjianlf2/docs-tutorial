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
import ImageResize from 'tiptap-extension-resize-image';
import Underline from '@tiptap/extension-underline'
import FontFamily from '@tiptap/extension-font-family'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import { useEditorStore } from '@/store/use-editor-store'
import TextStyle from '@tiptap/extension-text-style'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import { FontSizeExtension } from '@/extensions/font-size'

const Editor = () => {
    const { setEditor } = useEditorStore();
    const editor = useEditor({
        onCreate({ editor }) {
            setEditor(editor);
        },
        onDestroy() {
            setEditor(null);
        },
        onUpdate({ editor }) {
            setEditor(editor);
        },
        onSelectionUpdate({ editor }) {
            setEditor(editor);
        },
        onTransaction({ editor }) {
            setEditor(editor);
        },
        onFocus({ editor }) {
            setEditor(editor);
        },
        onBlur({ editor }) {
            setEditor(editor);
        },
        onContentError({ editor }) {
            setEditor(editor);
        },
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
            ImageResize,
            Underline,
            TextStyle,
            FontFamily,
            Color,
            Highlight.configure({
                multicolor: true,
            }),
            Link.configure({
                openOnClick: false,
                defaultProtocol: 'https',
                autolink: true,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            FontSizeExtension
        ],
        content: `  <p>
          Wow, this editor has support for links to the whole <a href="https://en.wikipedia.org/wiki/World_Wide_Web">world wide web</a>. We tested a lot of URLs and I think you can add *every URL* you want. Isn’t that cool? Let’s try <a href="https://statamic.com/">another one!</a> Yep, seems to work.
        </p>
        <p>
          By default every link will get a <code>rel="noopener noreferrer nofollow"</code> attribute. It’s configurable though.
        </p>`,
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