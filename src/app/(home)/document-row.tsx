"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Building2Icon, CircleUserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { SiGoogledocs } from "react-icons/si";
import { Doc } from "../../../convex/_generated/dataModel";
import { DocumentMenu } from "./document-menu";

interface DocumentRowProps {
  document: Doc<"documents">;
}

export const DocumentRow = ({ document }: DocumentRowProps) => {
  const router = useRouter();

  const onNewTabClick = (id: string) => {
    window.open(`/documents/${id}`, "_blank");
  };

  const handleRowClick = (e: React.MouseEvent) => {
    // 如果点击的是菜单按钮，不触发行跳转
    if ((e.target as HTMLElement).closest('[role="menuitem"], button')) {
      return;
    }
    router.push(`/documents/${document._id}`);
  };

  return (
    <TableRow 
      className="cursor-pointer border-none hover:bg-[#f1f3f4] transition-colors" 
      key={document._id}
      onClick={handleRowClick}
    >
      <TableCell className="w-[50px] py-3 px-4">
        <SiGoogledocs className="size-6 fill-[#1a73e8]" />
      </TableCell>
      <TableCell className="py-3 px-4 text-sm font-normal">
        {document.title}
      </TableCell>
      <TableCell className="py-3 px-4 flex items-center gap-2 text-sm text-[#5f6368]">
        {document.organizationId ? (
          <Building2Icon className="size-4" />
        ) : (
          <CircleUserIcon className="size-4" />
        )}
        {document.organizationId ? "Organization" : "Personal"}
      </TableCell>
      <TableCell className="py-3 px-4 text-sm text-[#5f6368] hidden md:table-cell">
        {format(new Date(document._creationTime), "MMM dd, yyyy")}
      </TableCell>
      <TableCell className="py-3 px-4 ml-auto flex justify-end">
        <DocumentMenu
          documentId={document._id}
          title={document.title}
          onNewTab={onNewTabClick}
        />
      </TableCell>
    </TableRow>
  );
};
