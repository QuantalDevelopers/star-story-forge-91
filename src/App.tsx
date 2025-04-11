
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoryProvider } from "./contexts/StoryContext";
import Index from "./pages/Index";
import Create from "./pages/Create";
import Edit from "./pages/Edit";
import Practice from "./pages/Practice";
import Stories from "./pages/Stories";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <StoryProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/create" element={<Create />} />
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="/practice/:id" element={<Practice />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </StoryProvider>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
