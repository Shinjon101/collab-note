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
  const docs = await getUserDocs();

  const menuOptions = (
    <>
      <NewDocumentButton />
      <SidebarDocuments docs={docs} />
    </>
  );

  return (
    <div className="bg-gray-200 relative p-2 md:p-5">
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

      <div className="hidden md:inline">{menuOptions}</div>
    </div>
  );
}
