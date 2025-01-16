import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { Outlet } from "react-router";
import { Toaster } from "react-hot-toast";

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
        <div className="p-8 flex justify-center items-center h-screen">
          <Outlet />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
