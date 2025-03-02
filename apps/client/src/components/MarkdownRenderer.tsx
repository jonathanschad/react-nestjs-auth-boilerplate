import Markdown from 'react-markdown';

import { Typography } from '@client/components/ui/typography';

export const MarkdownRenderer = ({ children }: { children?: string | null | undefined }) => {
    return (
        <Markdown
            components={{
                h1: ({ children }) => <Typography element="h1">{children}</Typography>,
                h2: ({ children }) => <Typography element="h2">{children}</Typography>,
                h3: ({ children }) => <Typography element="h3">{children}</Typography>,
                h4: ({ children }) => <Typography element="h4">{children}</Typography>,
                h5: ({ children }) => <Typography element="h5">{children}</Typography>,
                h6: ({ children }) => <Typography element="h6">{children}</Typography>,
                p: ({ children }) => <Typography element="p">{children}</Typography>,
                ul: ({ children }) => <Typography element="ul">{children}</Typography>,
                blockquote: ({ children }) => <Typography element="blockquote">{children}</Typography>,
                code: ({ children }) => (
                    <Typography element="code" as="inlineCode">
                        {children}
                    </Typography>
                ),
                hr: () => <hr className="border-divider my-4 border-t" />,
            }}
        >
            {children}
        </Markdown>
    );
};
