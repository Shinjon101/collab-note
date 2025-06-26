import { getSharedDocs } from "../../actions/getSharedDocs";
import { getUserDocs } from "../../actions/getUserDocuments";
import SidebarDocuments from "../components/SideBarDocuments"; // adjust import if needed
import NewDocumentButton from "./NewDocumentButton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";

export default async function SideBar() {
  const createdDocs = await getUserDocs();
  const sharedDocs = await getSharedDocs();

  const menuOptions = (
    <>
      <NewDocumentButton />
      <SidebarDocuments createdDocs={createdDocs} sharedDocs={sharedDocs} />
    </>
  );

  return (
    <aside className="relative p-2 md:p-5 bg-accent">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <MenuIcon className=" hover:opacity-75 transition-opacity ease-in-out" />
          </SheetTrigger>
          <SheetContent
            side="left"
            className=" w-[400px] sm:w-[540px] items-center "
          >
            <SheetHeader className="items-center gap-5">
              <SheetTitle>Menu</SheetTitle>
              <div>{menuOptions}</div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden md:flex md:flex-col items-center justify-center ">
        {menuOptions}
      </div>
    </aside>
  );
}
