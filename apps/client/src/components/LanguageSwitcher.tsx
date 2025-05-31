import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { Button } from '@boilerplate/ui/components/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@boilerplate/ui/components/dropdown-menu';
import { Typography } from '@boilerplate/ui/components/typography';
import { Translation } from '@boilerplate/ui/i18n/Translation';

const mapLanguageToFlag = (language: string) => {
    switch (language) {
        case 'de':
            return 'de';
        case 'en':
            return 'gb';
        default:
            return 'gb';
    }
};

export const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="flex items-center justify-center gap-2 rounded-full">
                    <FlagIcon flag={mapLanguageToFlag(i18n.language)} />
                    <Typography className="uppercase leading-3" as={'bold'} style={{ marginTop: '-0.125rem' }}>
                        {i18n.language}
                    </Typography>
                    <span className="sr-only">
                        <Translation>toggleLanguageSelectionMenu</Translation>
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => void i18n.changeLanguage('de')} className="flex items-center">
                    <FlagIcon flag="de" className="mr-4" />
                    <span>Deutsch</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => void i18n.changeLanguage('en')} className="flex items-center">
                    <span className="fi fi-gb mr-4"></span>
                    <span>English</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const FlagIcon = ({ flag, className }: { flag: string; className?: string }) => {
    return <span className={clsx(`fi fi-${flag}`, className)}></span>;
};
