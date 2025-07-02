import { getUserDocs } from "../../../actions/getUserDocuments";
import { getSharedDocs } from "../../../actions/getSharedDocs";
import SidebarDocumentsWrapper from "./SidebarDocumentsWrapper";
import { auth } from "@clerk/nextjs/server";

export default async function SidebarDocumentsServer() {
  const createdDocs = await getUserDocs();
  const sharedDocs = await getSharedDocs();
  const { userId } = await auth();

  if (!userId) return;
  return (
    <SidebarDocumentsWrapper
      initialCreated={createdDocs}
      initialShared={sharedDocs}
      userId={userId}
    />
  );
}
