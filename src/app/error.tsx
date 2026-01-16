"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangleIcon } from "lucide-react";
import Link from "next/link";

const ErrorPage = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
        {/* 错误图标 */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-xl animate-pulse" />
            <div className="relative bg-gradient-to-br from-rose-100 to-rose-50 dark:from-rose-950/50 dark:to-rose-900/30 p-6 rounded-full border border-rose-200/50 dark:border-rose-800/50 shadow-lg">
              <AlertTriangleIcon className="size-12 text-rose-600 dark:text-rose-400" />
            </div>
          </div>
        </div>

        {/* 错误信息 */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            出错了
          </h1>
          <h2 className="text-xl font-semibold text-foreground/90">
            Something went wrong
          </h2>
          <div className="pt-2">
            <p className="text-sm text-muted-foreground leading-relaxed bg-muted/50 dark:bg-muted/30 rounded-lg p-4 border border-border/50">
              {error.message || "发生了意外错误，请稍后重试"}
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground/60 mt-2 font-mono">
                错误代码: {error.digest}
              </p>
            )}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button 
            onClick={reset} 
            className="font-medium px-8 min-w-[140px] shadow-sm hover:shadow-md transition-all duration-200"
            size="lg"
          >
            重试
          </Button>
          <Button 
            asChild
            variant="outline" 
            className="font-medium px-8 min-w-[140px] border-2 hover:bg-accent transition-all duration-200"
            size="lg"
          >
            <Link href="/">返回首页</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
