import { Translation } from '@boilerplate/ui/i18n/Translation';
import { Link } from 'react-router-dom';

export const ProjectLogo = () => {
    return (
        <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <Translation element="span" className="inline md:hidden lg:inline flex-auto flex-shrink-0">
                projectName
            </Translation>
            <span className="sr-only">
                <Translation>projectName</Translation>
            </span>
        </Link>
    );
};
