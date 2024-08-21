import * as React from 'react';

interface NotSignedInLayoutProps {
    children?: React.ReactNode;
    illustration?: React.ReactNode;
}
export const NotSignedInLayout = ({ children, illustration }: NotSignedInLayoutProps) => {
    return (
        <div className="h-full w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">{children}</div>
            </div>
            <div className="hidden max-w-full bg-muted lg:block">
                <div className="flex h-full items-center justify-center p-4">{illustration}</div>
            </div>
        </div>
    );
};
