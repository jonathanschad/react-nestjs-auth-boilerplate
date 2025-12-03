import { QueryClient, QueryClientProvider } from 'react-query';

import '@/i18n/i18n';
import '/node_modules/flag-icons/css/flag-icons.min.css';

import { Toaster } from '@darts/ui/components/sonner';
import { Analytics } from '@/Analytics';
import LoadingApplication from '@/pages/LoadingApplication';
import { Routes } from '@/Routes';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="h-screen w-screen overflow-auto">
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
