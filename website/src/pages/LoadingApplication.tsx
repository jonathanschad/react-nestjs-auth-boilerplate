import { useQuery } from 'react-query';

import { renewAccessToken } from '@/repository/auth';

const LoadingApplication = () => {
    useQuery({
        queryFn: () => renewAccessToken(),
        onError: (error) => {
            console.error('Failed to renew access token', error);
        },
        retry: true,
    });
    return (
        <div>
            <h1>LoadingApplication</h1>
        </div>
    );
};

export default LoadingApplication;
