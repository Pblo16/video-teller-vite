"use client"
import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { SquareTerminal } from "lucide-react"

// This is sample data.
// This is sample data.
const data = {
  navMain: [
    {
      title: "Juego",
      url: "/",
      icon: SquareTerminal,

    },
    {
      title: "Llama-3.2-1B",
      url: "/agente-inteligente",
      icon: SquareTerminal,

    },
  ],

}


export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} className="bg-zinc-950 border-none">
      <SidebarHeader>
        <div className="flex flex-1 justify-center items-center h-32 gap-4">
          V-T
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3">
        <NavMain items={data.navMain} />
      </SidebarContent>

    </Sidebar>
  )
}
