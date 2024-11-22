import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from "./theme-provider";
import { SidebarRight } from "./sidebar-right";
import { SidebarLeft } from "./sidebar-left";

function Layout() {
    const location = useLocation();
    const selectedItems = location.state?.selectedItems || [];

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="h-dvh bg-zinc-900">
                <SidebarProvider>
                    <SidebarLeft />
                    <SidebarInset>
                        <Outlet />
                    </SidebarInset>
                    <SidebarRight
                        imageUrl="src\assets\images\Torito.webp"
                        selectedItems={selectedItems}
                    />
                </SidebarProvider>
            </div>
        </ThemeProvider>
    );
}

export default Layout;