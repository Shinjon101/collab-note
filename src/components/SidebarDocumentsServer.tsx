import { getUserDocs } from "../../actions/getUserDocuments";
import { getSharedDocs } from "../../actions/getSharedDocs";
import SidebarDocumentsWrapper from "./SidebarDocumentsWrapper";

export default async function SidebarDocumentsServer() {
  const createdDocs = await getUserDocs();
  const sharedDocs = await getSharedDocs();

  return (
    <SidebarDocumentsWrapper
      initialCreated={createdDocs}
      initialShared={sharedDocs}
    />
  );
}
