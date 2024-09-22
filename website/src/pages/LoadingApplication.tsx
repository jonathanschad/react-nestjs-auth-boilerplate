import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { renewAccessToken } from '@/repository/auth';

const LoadingApplication = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    useQuery({
        queryFn: () => renewAccessToken(),
        onError: (error) => {
            console.error('Failed to renew access token', error);
        },
        onSuccess: () => {
            const callbackUrl = searchParams.get('callbackUrl') || '/';
            navigate(callbackUrl);
        },
        retry: true,
    });
    return (
        <div>
            <h1>Loading Application</h1>
        </div>
    );
};

export default LoadingApplication;
