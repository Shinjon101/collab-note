import NewDocumentButton from "./NewDocumentButton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import SidebarDocumentsWrapper from "./SidebarDocumentsWrapper";
import SidebarDocumentsServer from "./SidebarDocumentsServer";

export default async function SideBar() {
  const menuOptions = (
    <>
      <NewDocumentButton />
      <SidebarDocumentsServer />
    </>
  );

  return (
    <aside className="relative p-2 md:p-5 bg-accent">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <MenuIcon className=" hover:opacity-75 transition-opacity ease-in-out mt-5" />
          </SheetTrigger>
          <SheetContent side="left" className=" w-max-[300px] items-center">
            <SheetHeader className="items-center gap-5">
              <SheetTitle>Menu</SheetTitle>
              <div className="flex flex-col items-center">{menuOptions}</div>
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
