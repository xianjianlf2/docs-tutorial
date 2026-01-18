import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 根据用户名生成颜色
 * 将名字转换为数字，然后计算 HSL 色相值
 */
export function generateUserColor(name: string): string {
  const nameToNumber = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = Math.abs(nameToNumber % 360);
  return `hsl(${hue}, 80%, 50%)`;
}
