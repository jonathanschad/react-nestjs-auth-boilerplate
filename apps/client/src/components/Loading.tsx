import { LoadingSpinner } from '@boilerplate/ui/components/loading-spinner';

type LoadingProps = {
    isLoading: boolean;
    loadingMessage?: React.ReactNode;
    children: React.ReactNode;
};

export const Loading = ({ children, isLoading, loadingMessage }: LoadingProps) => {
    if (!isLoading) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-full w-full items-center justify-center">
            <LoadingSpinner />
            {loadingMessage ? <div className="ml-4">{loadingMessage}</div> : null}
        </div>
    );
};
