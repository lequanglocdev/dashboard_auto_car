import AppSidebar from "@/components/dashboard/appsidebar/AppSidebar";
import Navbar from "@/components/dashboard/navbar/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ui/theme-provider";

const Promotion = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider defaultOpen={true}>
        <div className="h-screen w-full bg-muted/40 flex overflow-hidden">
          <AppSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar />

            <main className="flex-1 max-w-7xl w-full mx-auto overflow-y-auto p-6">
              {/* Page content */}
              <h1 className="text-2xl font-bold mb-4">Promotion Management</h1>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default Promotion;
