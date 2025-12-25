import type { GameVisitEntityApiDTO } from '@boilerplate/types';
import { TableCell, TableRow } from '@boilerplate/ui/components/table';
import { Typography } from '@boilerplate/ui/components/typography';
import { Translation } from '@boilerplate/ui/i18n/Translation';
import { Crown } from 'lucide-react';
import { formatThrow } from './formatThrow';

export const VisitRow = ({
    visit,
    visitNumber,
    winnerId,
}: {
    visit: GameVisitEntityApiDTO;
    visitNumber: number;
    winnerId: string;
}) => {
    const isBust = visit.outcome === 'BUSTED';
    const isWinningVisit = visit.remainingScoreAfter === 0 && !isBust && visit.playerId === winnerId;

    // Determine which throws to display based on bust/win status
    let throw1 = formatThrow({ value: visit.throw1, multiplier: visit.throw1Multiplier });
    let throw2 = formatThrow({ value: visit.throw2, multiplier: visit.throw2Multiplier });
    let throw3 = formatThrow({ value: visit.throw3, multiplier: visit.throw3Multiplier });

    // Determine which throw was the winning throw
    let winningThrowIndex = 0; // 1, 2, or 3

    // After a bust or win, don't show subsequent throws
    if (isBust || isWinningVisit) {
        // Check if the bust/win happened on throw 1
        if (visit.throw1 !== null && visit.throw1 !== 0) {
            const throw1Score = visit.throw1 * (visit.throw1Multiplier ?? 1);
            const remainingAfterThrow1 = visit.remainingScoreBefore - throw1Score;
            if (remainingAfterThrow1 === 0 && isWinningVisit) {
                winningThrowIndex = 1;
            }
            if (remainingAfterThrow1 <= 0 || remainingAfterThrow1 === 1) {
                throw2 = '-';
                throw3 = '-';
            }
        }
        // Check if the bust/win happened on throw 2
        if (visit.throw2 !== null && visit.throw2 !== 0 && throw2 !== '-') {
            const throw1Score = (visit.throw1 ?? 0) * (visit.throw1Multiplier ?? 1);
            const throw2Score = visit.throw2 * (visit.throw2Multiplier ?? 1);
            const remainingAfterThrow2 = visit.remainingScoreBefore - throw1Score - throw2Score;
            if (remainingAfterThrow2 === 0 && isWinningVisit) {
                winningThrowIndex = 2;
            }
            if (remainingAfterThrow2 <= 0 || remainingAfterThrow2 === 1) {
                throw3 = '-';
            }
        }
        // Check if the win happened on throw 3
        if (visit.throw3 !== null && visit.throw3 !== 0 && throw3 !== '-' && isWinningVisit) {
            const throw1Score = (visit.throw1 ?? 0) * (visit.throw1Multiplier ?? 1);
            const throw2Score = (visit.throw2 ?? 0) * (visit.throw2Multiplier ?? 1);
            const throw3Score = visit.throw3 * (visit.throw3Multiplier ?? 1);
            const remainingAfterThrow3 = visit.remainingScoreBefore - throw1Score - throw2Score - throw3Score;
            if (remainingAfterThrow3 === 0) {
                winningThrowIndex = 3;
            }
        }
    }

    const rowClassName = isBust
        ? 'bg-red-50 dark:bg-red-950/20'
        : isWinningVisit
          ? 'bg-green-50 dark:bg-green-950/20'
          : '';

    const CrownIcon = () => <Crown className="ml-1 inline h-4 w-4 text-yellow-600 dark:text-yellow-400" />;

    return (
        <TableRow className={rowClassName}>
            <TableCell>
                <Typography as="normalText">{visitNumber}</Typography>
            </TableCell>
            <TableCell>
                <Typography as="normalText">
                    {throw1}
                    {isWinningVisit && winningThrowIndex === 1 && <CrownIcon />}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography as="normalText">
                    {throw2}
                    {isWinningVisit && winningThrowIndex === 2 && <CrownIcon />}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography as="normalText">
                    {throw3}
                    {isWinningVisit && winningThrowIndex === 3 && <CrownIcon />}
                </Typography>
            </TableCell>
            <TableCell>
                {isBust ? (
                    <Typography as="normalText" className="font-semibold">
                        <Translation>bust</Translation>
                    </Typography>
                ) : (
                    <Typography as="normalText" className="font-semibold">
                        {visit.totalScored}
                    </Typography>
                )}
            </TableCell>
            <TableCell>
                <Typography as="normalText">{visit.remainingScoreAfter}</Typography>
            </TableCell>
        </TableRow>
    );
};
