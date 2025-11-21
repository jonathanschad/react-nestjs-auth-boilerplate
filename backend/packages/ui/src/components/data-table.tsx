import { Button } from '@darts/ui/components/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@darts/ui/components/table';
import { Translation } from '@darts/ui/i18n/Translation';
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type PaginationState,
    type SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

interface DataTableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
}

export const DataTable = <T,>({ columns, data }: DataTableProps<T>) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const table = useReactTable({
        data: data,
        columns: columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onPaginationChange: setPagination,
        state: {
            sorting,
            pagination,
        },
    });

    return (
        <div className="flex h-full w-full flex-col overflow-auto">
            <div className="h-full w-full flex-auto overflow-auto rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex-shrink-0 flex-grow-0 items-center justify-end space-x-2 py-4">
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <Translation>previous</Translation>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            console.log('next');
                            table.nextPage();
                        }}
                        disabled={!table.getCanNextPage()}
                    >
                        <Translation>next</Translation>
                    </Button>
                </div>
            </div>
        </div>
    );
};
