import { QueryClient, QueryClientProvider } from 'react-query';

import '@/i18n/i18n';
import '/node_modules/flag-icons/css/flag-icons.min.css';

import { Toaster } from '@boilerplate/ui/components/sonner';
import { Analytics } from '@/Analytics';
import LoadingApplication from '@/pages/LoadingApplication';
import { Routes } from '@/Routes';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false, // Don't refetch when window regains focus
            refetchOnMount: false, // Don't refetch when component mounts if data exists
            refetchOnReconnect: false, // Don't refetch when network reconnects
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="h-screen w-screen">
                <LoadingApplication>
                    <Routes />
                    <Analytics />
                    <Toaster />
                </LoadingApplication>
            </div>
        </QueryClientProvider>
    );
}

export default App;
