import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { Outlet } from "react-router";
import { Toaster } from "react-hot-toast";
import { Header } from "@/components/Header";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster />
        <Header />
        <main className="pt-16 min-h-screen">
          <div className=" flex flex-col items-center justify-center p-8 pt-16">
            <Outlet />
          </div>
        </main>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
