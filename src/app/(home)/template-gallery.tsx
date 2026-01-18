"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { templates } from "@/constants/templates";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";

export const TemplateGallery = () => {
  const router = useRouter();
  const createDocument = useMutation(api.documents.create);
  const [isCreating, setIsCreating] = useState(false);

  const onTemplateClick = (title: string, initialContent: string) => {
    setIsCreating(true);
    toast.loading("Creating document...", { id: "create-document" });
    createDocument({ title, initialContent })
      .then((documentId) => {
        toast.success("Document created successfully", { id: "create-document" });
        router.push(`/documents/${documentId}`);
      })
      .catch(() => {
        toast.error("Failed to create document", { id: "create-document" });
      })
      .finally(() => {
        setIsCreating(false);
      });
  };

  return (
    <div className="bg-[#f1f3f4] ">
      <div className="max-w-screen-xl mx-auto px-16 py-6 flex flex-col gap-y-4">
        <h3 className="font-medium">Start a new document</h3>
        <Carousel>
          <CarouselContent className="-ml-4">
            {templates.map((template) => (
              <CarouselItem
                key={template.id}
                className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-1/7 pl-4"
              >
                <div
                  className={cn(
                    "aspect-[3/4] flex flex-col gap-y-2.5",

                    isCreating && "pointer-events-none opacity-50"
                  )}
                >
                  <button
                    disabled={isCreating}
                    // todo: add proper initial content
                    onClick={() => onTemplateClick(template.label, "")}
                    style={{
                      backgroundImage: `url(${template.imageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                    className="size-full hover:border-blue-500 rounded-sm border hover:bg-blue-50 transition flex flex-col items-center justify-center gap-y-4 bg-white relative"
                  >
                    {isCreating && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-sm">
                        <LoaderIcon className="size-6 animate-spin text-[#1a73e8]" />
                      </div>
                    )}
                  </button>
                  <p className="text-sm font-medium truncate">
                    {template.label}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext />
          <CarouselPrevious />
        </Carousel>
      </div>
    </div>
  );
};
