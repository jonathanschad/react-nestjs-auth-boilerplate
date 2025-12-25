import type { GameVisitEntityApiDTO } from '@boilerplate/types';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@boilerplate/ui/components/table';
import { Translation } from '@boilerplate/ui/i18n/Translation';
import { VisitRow } from './VisitRow';

export const VisitsTable = ({
    visits,
    playerId,
    winnerId,
}: {
    visits: GameVisitEntityApiDTO[];
    playerId: string;
    winnerId: string;
}) => {
    const playerVisits = visits
        .filter((visit) => visit.playerId === playerId)
        .sort((a, b) => a.visitNumber - b.visitNumber);

    return (
        <div className="overflow-auto rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <Translation>visit</Translation>
                        </TableHead>
                        <TableHead>
                            <Translation>throw1</Translation>
                        </TableHead>
                        <TableHead>
                            <Translation>throw2</Translation>
                        </TableHead>
                        <TableHead>
                            <Translation>throw3</Translation>
                        </TableHead>
                        <TableHead>
                            <Translation>scored</Translation>
                        </TableHead>
                        <TableHead>
                            <Translation>remaining</Translation>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {playerVisits.map((visit) => (
                        <VisitRow
                            key={visit.id}
                            visit={visit}
                            visitNumber={visit.visitNumber + 1}
                            winnerId={winnerId}
                        />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
