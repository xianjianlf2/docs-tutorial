import {
    DEFAULT_MARGIN,
    MIN_MARGIN_GAP,
    RULER_WIDTH,
} from "@/constants/editor";
import { useMutation, useStorage } from "@liveblocks/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaCaretDown } from "react-icons/fa";

const markers = Array.from({ length: 83 }, (_, index) => index + 1);

interface MarkerProps {
  position: number;
  isLeft: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onDoubleClick: () => void;
}

const Marker = ({
  position,
  isLeft,
  onMouseDown,
  onDoubleClick,
}: MarkerProps) => {
  return (
    <div
      className="absolute top-0 w-4 h-full cursor-ew-resize z-[5] group"
      style={{ [isLeft ? "left" : "right"]: `${position}px` }}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
    >
      <FaCaretDown className="absolute left-1/2 top-0 h-full fill-blue-500 transform -translate-x-1/2" />
    </div>
  );
};

const Ruler = () => {
  // 从 Liveblocks storage 读取边距值，提供默认值
  const leftMargin = useStorage((root) => root.leftMargin) ?? DEFAULT_MARGIN;
  const rightMargin = useStorage((root) => root.rightMargin) ?? DEFAULT_MARGIN;

  // 使用 useMutation 定义边距更新函数（这些函数引用是稳定的）
  const setLeftMargin = useMutation(({ storage }, position: number) => {
    storage.set("leftMargin", position);
  }, []);

  const setRightMargin = useMutation(({ storage }, position: number) => {
    storage.set("rightMargin", position);
  }, []);

  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);
  const [dragLinePosition, setDragLinePosition] = useState<number | null>(null);

  const rulerRef = useRef<HTMLDivElement>(null);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);

  // 使用 useCallback 包装处理函数，确保引用稳定
  const handleDoubleClickLeft = useCallback(() => {
    setLeftMargin(DEFAULT_MARGIN);
  }, [setLeftMargin]);

  const handleDoubleClickRight = useCallback(() => {
    setRightMargin(DEFAULT_MARGIN);
  }, [setRightMargin]);

  const handleMouseDownLeft = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingLeft(true);
    // 初始化拖拽线位置
    if (rulerRef.current) {
      const container = rulerRef.current.querySelector(
        "#ruler-container"
      ) as HTMLElement;
      if (container) {
        const containerRect = container.getBoundingClientRect();
        setDragLinePosition(containerRect.left + leftMargin);
      }
    }
  };

  const handleMouseDownRight = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingRight(true);
    // 初始化拖拽线位置
    if (rulerRef.current) {
      const container = rulerRef.current.querySelector(
        "#ruler-container"
      ) as HTMLElement;
      if (container) {
        const containerRect = container.getBoundingClientRect();
        setDragLinePosition(containerRect.left + (RULER_WIDTH - rightMargin));
      }
    }
  };

  // 使用 ref 存储最新的边距值，避免依赖项问题
  const leftMarginRef = useRef(leftMargin);
  const rightMarginRef = useRef(rightMargin);

  useEffect(() => {
    leftMarginRef.current = leftMargin;
    rightMarginRef.current = rightMargin;
  }, [leftMargin, rightMargin]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!rulerRef.current || (!isDraggingLeft && !isDraggingRight)) return;

      const container = rulerRef.current.querySelector(
        "#ruler-container"
      ) as HTMLElement;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const relativeX = e.clientX - containerRect.left;
      const rawPosition = Math.max(0, Math.min(RULER_WIDTH, relativeX));

      // 更新拖拽线位置（使用全局坐标）
      setDragLinePosition(e.clientX);

      if (isDraggingLeft) {
        // 使用 ref 中的最新值
        const maxLeftPosition =
          RULER_WIDTH - rightMarginRef.current - MIN_MARGIN_GAP;
        const newLeftPosition = Math.min(rawPosition, maxLeftPosition);
        setLeftMargin(newLeftPosition);
      } else if (isDraggingRight) {
        // 使用 ref 中的最新值
        const rightPosition = RULER_WIDTH - rawPosition;
        // 计算最小右边距：确保右边距标记不会超过左边距标记 + 最小间距
        const maxRightMargin =
          RULER_WIDTH - (leftMarginRef.current + MIN_MARGIN_GAP);
        // 限制右边距在有效范围内，但不能小于左边距 + 最小间距
        const newRightPosition = Math.max(
          0,
          Math.min(rightPosition, maxRightMargin)
        );
        setRightMargin(newRightPosition);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingLeft(false);
      setIsDraggingRight(false);
      setDragLinePosition(null);
    };

    if (isDraggingLeft || isDraggingRight) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      // 防止鼠标选择文本
      document.body.style.userSelect = "none";
      document.body.style.cursor = "ew-resize";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isDraggingLeft, isDraggingRight, setLeftMargin, setRightMargin]);

  // 获取编辑器容器的引用
  useEffect(() => {
    const findEditorContainer = () => {
      const proseMirror = document.querySelector(".ProseMirror");
      if (proseMirror) {
        // 向上查找包含编辑器的容器（查找具有 816px 宽度的容器）
        let parent = proseMirror.parentElement;
        let found = false;
        while (parent && !found) {
          const computedStyle = getComputedStyle(parent);
          const width = computedStyle.width;
          // 检查是否是编辑器容器（宽度为 816px 或其父容器）
          if (
            width === "816px" ||
            parent.querySelector('div[style*="816px"]')
          ) {
            // 查找包含这个元素的包装容器
            let wrapper = parent;
            while (wrapper && wrapper.parentElement) {
              const wrapperStyle = getComputedStyle(wrapper.parentElement);
              if (
                wrapperStyle.width.includes("816") ||
                wrapper.offsetWidth === 816
              ) {
                editorContainerRef.current =
                  wrapper.parentElement as HTMLDivElement;
                found = true;
                break;
              }
              wrapper = wrapper.parentElement;
            }
            if (!found) {
              editorContainerRef.current = parent as HTMLDivElement;
              found = true;
            }
          }
          if (!found) {
            parent = parent.parentElement;
          }
        }
        // 如果还是没找到，使用 ProseMirror 向上查找直到找到有固定宽度的容器
        if (!editorContainerRef.current) {
          let current = proseMirror.parentElement;
          while (current) {
            if (current.offsetWidth >= 800 && current.offsetWidth <= 900) {
              editorContainerRef.current = current as HTMLDivElement;
              break;
            }
            current = current.parentElement;
          }
        }
      }
    };

    // 延迟查找，确保编辑器已渲染
    const timeoutId = setTimeout(findEditorContainer, 100);
    findEditorContainer(); // 立即尝试一次

    // 监听 DOM 变化，如果编辑器还没加载完成
    const observer = new MutationObserver(() => {
      if (!editorContainerRef.current) {
        findEditorContainer();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  // 初始化边界验证：确保边距值在有效范围内（主要用于初次加载或外部数据变更）
  // useMutation 返回的函数引用是稳定的，可以安全地包含在依赖数组中
  useEffect(() => {
    // 只在组件挂载时验证一次
    const minLeftMargin = 0;
    const maxLeftMargin = RULER_WIDTH - rightMargin - MIN_MARGIN_GAP;
    
    if (leftMargin < minLeftMargin || leftMargin > maxLeftMargin) {
      const validLeftMargin = Math.max(
        minLeftMargin,
        Math.min(leftMargin, maxLeftMargin)
      );
      setLeftMargin(validLeftMargin);
    }

    const minRightMargin = 0;
    const maxRightMargin = RULER_WIDTH - leftMargin - MIN_MARGIN_GAP;
    
    if (rightMargin < minRightMargin || rightMargin > maxRightMargin) {
      const validRightMargin = Math.max(
        minRightMargin,
        Math.min(rightMargin, maxRightMargin)
      );
      setRightMargin(validRightMargin);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 仅在组件挂载时运行一次

  // 渲染拖拽虚线指示器
  const renderDragLine = () => {
    if (!dragLinePosition || (!isDraggingLeft && !isDraggingRight)) return null;

    const editorContainer = editorContainerRef.current;
    if (!editorContainer) return null;

    const editorRect = editorContainer.getBoundingClientRect();
    const rulerRect = rulerRef.current?.getBoundingClientRect();
    if (!rulerRect) return null;

    // 计算虚线应该延伸的高度（从标尺底部到编辑器容器底部）
    const lineTop = rulerRect.bottom;
    const lineHeight = Math.max(0, editorRect.bottom - lineTop);

    return createPortal(
      <div
        className="fixed pointer-events-none z-50 print:hidden"
        style={{
          left: `${dragLinePosition}px`,
          top: `${lineTop}px`,
          height: `${lineHeight}px`,
          width: "1px",
          background:
            "repeating-linear-gradient(to bottom, transparent, transparent 4px, #3b82f6 4px, #3b82f6 8px)",
        }}
      />,
      document.body
    );
  };

  return (
    <>
      <div
        ref={rulerRef}
        className="relative w-full h-6 bg-neutral-100 mb-2 print:hidden"
      >
        <div
          id="ruler-container"
          className="relative w-full h-full mx-auto"
          style={{ maxWidth: `${RULER_WIDTH}px` }}
        >
          {/* 标尺刻度 */}
          <div className="relative w-full h-full">
            {markers.map((marker) => {
              const position = marker * 10; // 每个刻度10px
              if (position > RULER_WIDTH) return null;

              return (
                <div
                  key={marker}
                  className="absolute bottom-0"
                  style={{ left: `${position}px` }}
                >
                  {marker % 10 === 0 ? (
                    // 每10个单位：显示长刻度和数字
                    <>
                      <div className="absolute bottom-0 w-[1px] h-3 bg-neutral-500"></div>
                      <span className="absolute bottom-3 text-[10px] text-neutral-500 whitespace-nowrap -translate-x-1/2 left-1/2">
                        {Math.floor(marker / 10)}
                      </span>
                    </>
                  ) : marker % 5 === 0 ? (
                    // 每5个单位：显示中等刻度
                    <div className="absolute bottom-0 w-[1px] h-2 bg-neutral-400"></div>
                  ) : (
                    // 其他单位：显示短刻度
                    <div className="absolute bottom-0 w-[1px] h-1 bg-neutral-300"></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 左右边距标记 */}
          <Marker
            position={leftMargin}
            isLeft={true}
            onMouseDown={handleMouseDownLeft}
            onDoubleClick={handleDoubleClickLeft}
          />
          <Marker
            position={rightMargin}
            isLeft={false}
            onMouseDown={handleMouseDownRight}
            onDoubleClick={handleDoubleClickRight}
          />

          {/* 显示边距区域 */}
          <div
            className="absolute top-0 h-full bg-blue-100/30 border-l border-r border-blue-300"
            style={{
              left: `${leftMargin}px`,
              right: `${rightMargin}px`,
            }}
          />
        </div>
      </div>
      {renderDragLine()}
    </>
  );
};

export default Ruler;
