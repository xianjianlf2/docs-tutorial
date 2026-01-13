import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginationStatus } from "convex/react";
import { LoaderIcon } from "lucide-react";
import { Doc } from "../../../convex/_generated/dataModel";
import { DocumentRow } from "./document-row";

interface DocumentsTableProps {
  documents: Doc<"documents">[];
  loadMore: (numItems: number) => void;
  status: PaginationStatus;
}

export const DocumentsTable = ({
  documents,
  loadMore,
  status,
}: DocumentsTableProps) => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-16 py-6 flex flex-col gap-5">
      {status === "LoadingFirstPage" ? (
        <div className="flex justify-center items-center h-24">
          <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-[50px] h-10 px-4 text-xs font-normal text-[#5f6368]">
                &nbsp;
              </TableHead>
              <TableHead className="h-10 px-4 text-xs font-normal text-[#5f6368]">
                Name
              </TableHead>
              <TableHead className="hidden md:table-cell h-10 px-4 text-xs font-normal text-[#5f6368]">
                Shared
              </TableHead>
              <TableHead className="hidden md:table-cell h-10 px-4 text-xs font-normal text-[#5f6368]">
                Created at
              </TableHead>
              <TableHead className="h-10 px-4 text-xs font-normal text-[#5f6368]">
                &nbsp;
              </TableHead>
            </TableRow>
          </TableHeader>
          {documents.length === 0 ? (
            <TableBody>
              <TableRow className="hover:bg-transparent border-none">
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground border-none"
                >
                  No documents found
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {documents.map((document) => (
                <DocumentRow key={document._id} document={document} />
              ))}
            </TableBody>
          )}
        </Table>
      )}
      {status === "CanLoadMore" && (
        <div className="flex justify-center pt-4">
          <Button
            variant="ghost"
            onClick={() => loadMore(10)}
            className="text-sm text-[#1a73e8] hover:bg-[#f1f3f4]"
          >
            Load More
          </Button>
        </div>
      )}
      {status === "Exhausted" && (
        <div className="flex justify-center pt-4">
          <Button
            variant="ghost"
            onClick={() => loadMore(10)}
            disabled
            className="text-sm text-muted-foreground"
          >
            No More
          </Button>
        </div>
      )}
    </div>
  );
};
