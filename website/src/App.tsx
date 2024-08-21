import '@/i18n/i18n';

import { QueryClient, QueryClientProvider } from 'react-query';

import { Routes } from '@/Routes';
const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="h-screen w-screen">
                <Routes />
            </div>
        </QueryClientProvider>
    );
}

export default App;
