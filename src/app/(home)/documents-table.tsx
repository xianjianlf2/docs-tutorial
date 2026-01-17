import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
        <div className="space-y-4">
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-3">
              <LoaderIcon className="size-8 animate-spin text-blue-600" />
              <p className="text-sm text-muted-foreground">Loading documents...</p>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="w-[50px] h-10 px-4">&nbsp;</TableHead>
                <TableHead className="h-10 px-4">
                  <Skeleton className="h-3 w-12" />
                </TableHead>
                <TableHead className="hidden md:table-cell h-10 px-4">
                  <Skeleton className="h-3 w-16" />
                </TableHead>
                <TableHead className="hidden md:table-cell h-10 px-4">
                  <Skeleton className="h-3 w-20" />
                </TableHead>
                <TableHead className="h-10 px-4">&nbsp;</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index} className="hover:bg-transparent border-b">
                  <TableCell className="px-4 py-3">
                    <Skeleton className="h-6 w-6 rounded" />
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Skeleton className="h-5 w-[200px] md:w-[300px]" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell px-4 py-3">
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell px-4 py-3">
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Skeleton className="h-6 w-6 rounded" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
