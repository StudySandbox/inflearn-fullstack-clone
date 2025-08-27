"use client";

import { Provider as JotaiProvider } from "jotai";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

interface Props {
  children: React.ReactNode;
}

const qeuryClient = new QueryClient();

export default function Providers({ children }: Props) {
  return (
    <JotaiProvider>
      <QueryClientProvider client={qeuryClient}>
        <Toaster />
        {children}
      </QueryClientProvider>
    </JotaiProvider>
  );
}
