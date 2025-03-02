import '@client/i18n/i18n';
import '/node_modules/flag-icons/css/flag-icons.min.css';

import { QueryClient, QueryClientProvider } from 'react-query';

import { Analytics } from '@client/Analytics';
import LoadingApplication from '@client/pages/LoadingApplication';
import { Routes } from '@client/Routes';
const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="h-screen w-screen overflow-auto">
                <LoadingApplication>
                    <Routes />
                    <Analytics />
                </LoadingApplication>
            </div>
        </QueryClientProvider>
    );
}

export default App;
