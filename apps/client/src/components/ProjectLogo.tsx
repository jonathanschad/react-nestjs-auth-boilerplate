import { Hexagon } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Translation } from '@boilerplate/ui/i18n/Translation';

export const ProjectLogo = () => {
    return (
        <Link to="/" className="flex items-center gap-2">
            <Hexagon className="h-6 w-6 flex-none" />
            <Translation element="span" className="flex-auto flex-shrink-0">
                projectName
            </Translation>
            <span className="sr-only">
                <Translation>projectName</Translation>
            </span>
        </Link>
    );
};
