import Editor from "./editor";
import Navbar from "./navbar";
import { Room } from "./room";
import Toolbar from "./toolbar";

interface DocumentsIdPageProps {
  params: Promise<{ documentId: string }>;
}

const DocumentsIdPage = async ({ params }: DocumentsIdPageProps) => {
  await params; // params 将用于未来的文档加载功能
  return (
    <Room>
      <div className="min-h-screen bg-[#fafbfd]">
        <div className="sticky top-0 z-50 bg-[#fafbfd] pt-2">
          <div className="flex flex-col px-4 gap-y-2 fixed top-0 left-0 right-0 z-10 bg-[#fafbfd] print:hidden">
            <Navbar />
            <Toolbar />
          </div>
        </div>
        <div className="pt-[114px] print:pt-0">
          <Editor />
        </div>
      </div>
    </Room>
  );
};

export default DocumentsIdPage;
