import { Extension } from "@tiptap/core";
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import type { EditorState, Transaction } from '@tiptap/pm/state';

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    lineHeight: {
      /**
       * 设置行高
       */
      setLineHeight: (lineHeight: string) => ReturnType;
      /**
       * 取消行高设置
       */
      unsetLineHeight: () => ReturnType;
    };
  }
}

export interface LineHeightOptions {
  /**
   * 应用行高的节点类型列表
   * @default ['paragraph', 'heading']
   */
  types: string[];
  /**
   * 默认行高值
   * @default 'normal'
   */
  defaultLineHeight: string;
}

export const LineHeightExtension = Extension.create<LineHeightOptions>({
  name: "lineHeight",
  
  addOptions() {
    return {
      types: ["paragraph", "heading"],
      defaultLineHeight: "normal",
    };
  },
  
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: this.options.defaultLineHeight,
            parseHTML: (element: HTMLElement) => {
              const lineHeight = element.style.lineHeight || this.options.defaultLineHeight;
              return lineHeight;
            },
            renderHTML: (attributes: Record<string, unknown>) => {
              if (!attributes.lineHeight || attributes.lineHeight === this.options.defaultLineHeight) {
                return {};
              }
              return {
                style: `line-height: ${attributes.lineHeight}`,
              };
            },
          },
        },
      },
    ];
  },
  
  addCommands() {
    return {
      setLineHeight:
        (lineHeight: string) =>
        ({ tr, state, dispatch }: { tr: Transaction; state: EditorState; dispatch?: (tr: Transaction) => void }) => {
          const { selection } = state;
          const { from, to } = selection;
          
          let modified = false;
          
          state.doc.nodesBetween(from, to, (node: ProseMirrorNode, pos: number) => {
            if (this.options.types.includes(node.type.name)) {
              const nodeAttrs = {
                ...node.attrs,
                lineHeight,
              };
              
              if (dispatch) {
                tr.setNodeMarkup(pos, undefined, nodeAttrs);
              }
              modified = true;
            }
          });
          
          if (modified && dispatch) {
            dispatch(tr);
          }
          
          return modified;
        },
      unsetLineHeight:
        () =>
        ({ tr, state, dispatch }: { tr: Transaction; state: EditorState; dispatch?: (tr: Transaction) => void }) => {
          const { selection } = state;
          const { from, to } = selection;
          
          let modified = false;
          
          state.doc.nodesBetween(from, to, (node: ProseMirrorNode, pos: number) => {
            if (this.options.types.includes(node.type.name)) {
              const nodeAttrs = {
                ...node.attrs,
                lineHeight: this.options.defaultLineHeight,
              };
              
              if (dispatch) {
                tr.setNodeMarkup(pos, undefined, nodeAttrs);
              }
              modified = true;
            }
          });
          
          if (modified && dispatch) {
            dispatch(tr);
          }
          
          return modified;
        },
    };
  },
});
