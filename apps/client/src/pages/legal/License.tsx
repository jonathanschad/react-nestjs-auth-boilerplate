import { Button } from '@darts/ui/components/button';
import { DataTable } from '@darts/ui/components/data-table';
import { Translation } from '@darts/ui/i18n/Translation';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import LegalSVG from '@/assets/illustrations/legal.svg?react';
import licenseClarificationsJSON from '@/assets/license-clarifications.json';
import licensesJSON from '@/assets/licenses.json';
import { useSetNotSignedInLayoutIllustration } from '@/layout/useSetNotSignedInLayoutIllustration';

interface License {
    name: string;
    version: string;
    licenses: LicenseTypes;
    repository?: string;
    publisher?: string;
    path: string;
    licenseFile: string;
    email?: string;
    private?: boolean;
}

enum LicenseTypes {
    Apache20 = 'Apache-2.0',
    BSD2Clause = 'BSD-2-Clause',
    BSD3Clause = 'BSD-3-Clause',
    BlueOak100 = 'BlueOak-1.0.0',
    Cc010 = 'CC0-1.0',
    CcBy30 = 'CC-BY-3.0',
    CcBy40 = 'CC-BY-4.0',
    ISC = 'ISC',
    MIT = 'MIT',
    MITAndCcBy30 = '(MIT AND CC-BY-3.0)',
    MITOrCc010 = '(MIT OR CC0-1.0)',
    Python20 = 'Python-2.0',
    The0BSD = '0BSD',
    Unlicense = 'Unlicense',
    Unlicensed = 'UNLICENSED',
}

const combinedLicenses: License[] = Object.entries({
    ...licensesJSON,
    ...licenseClarificationsJSON,
})
    .map(([key, value]) => {
        const parts = key.split('@');
        const name = parts.slice(0, -1).join('@');
        const version = parts[parts.length - 1];
        return { name, version, ...value } as License;
    })
    .sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    });

export const License = () => {
    return (
        <div className="mx-4 flex h-full w-full flex-col justify-center">
            <Translation className="mb-8 flex-shrink-0 flex-grow-0" as={'h1'}>
                licenses
            </Translation>
            <div className="w-full flex-shrink overflow-scroll">
                <DataTable data={combinedLicenses} columns={columns} />
            </div>
        </div>
    );
};

const LicenseIllustration = <LegalSVG className="m-8 w-full max-w-full" />;
export const NotSignedInLicense = () => {
    useSetNotSignedInLayoutIllustration(LicenseIllustration);
    return <License />;
};

const columns: ColumnDef<License>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="pl-0"
                >
                    <Translation>name</Translation>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
        accessorKey: 'publisher',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="pl-0"
                >
                    <Translation>publisher</Translation>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div>{row.getValue('publisher')}</div>,
    },
    {
        accessorKey: 'repository',
        header: () => <Translation>repository</Translation>,
        cell: ({ row }) => <div>{row.getValue('repository')}</div>,
    },
    {
        accessorKey: 'version',
        header: () => <Translation>version</Translation>,
        cell: ({ row }) => <div>{row.getValue('version')}</div>,
    },
    {
        accessorKey: 'licenses',
        header: () => <Translation>licenses</Translation>,
        cell: ({ row }) => <div>{row.getValue('licenses')}</div>,
    },
];
