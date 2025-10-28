import Editor from "./editor";
import Toolbar from "./toolbar";

interface DocumentsIdPageProps {
    params: Promise<{ documentId: string }>
}



const DocumentsIdPage = async ({ params }: DocumentsIdPageProps) => {
    const awaitParams = await params;
    const documentId = awaitParams.documentId;
    return (
        <div className="min-h-screen bg-[#fafbfd]">
            <Toolbar />
            <Editor />
        </div>
    )
}

export default DocumentsIdPage;