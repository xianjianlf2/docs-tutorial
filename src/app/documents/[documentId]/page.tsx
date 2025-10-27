import Editor from "./editor";

interface DocumentsIdPageProps {
    params: Promise<{ documentId: string }>
}



const DocumentsIdPage = async ({ params }: DocumentsIdPageProps) => {
    const awaitParams = await params;
    const documentId = awaitParams.documentId;
    return (
        <div className="min-h-screen bg-[#fafbfd]">
            Documents ID Page {documentId}
            <Editor />
        </div>
    )
}

export default DocumentsIdPage;