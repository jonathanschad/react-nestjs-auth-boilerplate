import '@/i18n/i18n';

import { QueryClient, QueryClientProvider } from 'react-query';

import LoadingApplication from '@/pages/LoadingApplication';
import { Routes } from '@/Routes';
const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="h-screen w-screen overflow-auto">
                <LoadingApplication>
                    <Routes />
                </LoadingApplication>
            </div>
        </QueryClientProvider>
    );
}

export default App;
