import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Item } from "../types"

interface SidebarRightProps extends React.ComponentProps<typeof Sidebar> {
  imageUrl?: string;
  selectedItems?: Item[];
}

export function SidebarRight({
  imageUrl,
  selectedItems = [],
  ...props
}: SidebarRightProps) {
  return (
    <Sidebar
      collapsible="none"
      className="sticky hidden lg:flex top-0 h-svh border-none bg-zinc-950"
      {...props}
    >
      <SidebarHeader className="h-60 ">
        <div className="mx-auto h-full w-full max-w-3xl rounded-xl bg-muted/50 overflow-hidden">
          <img
            src={imageUrl}
            alt="Sidebar image"
            className="w-full h-full object-cover"
          />
        </div>
      </SidebarHeader>
      <SidebarContent >
        <SidebarSeparator className="mx-0" />
        <div className="grid gap-4 p-4">
          {selectedItems.map((item, index) => (
            <div key={index} className="rounded-xl overflow-hidden">
              <img
                src={item.content}
                alt={item.alt}
                className="w-full h-40 object-cover"
              />
              <p className="text-sm mt-1">Score: {item.score}</p>
            </div>
          ))}
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
