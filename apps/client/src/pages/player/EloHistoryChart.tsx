import type { EloHistoryResponseDTO } from '@darts/types';
import { Card } from '@darts/ui/components/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@darts/ui/components/chart';
import { Skeleton } from '@darts/ui/components/skeleton';
import { Typography } from '@darts/ui/components/typography';
import { Translation } from '@darts/ui/i18n/Translation';
import dayjs from 'dayjs';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { useGetPlayerEloHistory } from '@/api/dart/player/useGetPlayerEloHistory';

type EloHistoryChartProps = {
    playerUuid: string;
};

type ChartDataPoint = {
    timestamp: number; // Unix timestamp in milliseconds for proper time scaling
    elo: number;
    displayDate: string;
};

export const EloHistoryChartSkeleton = () => {
    return (
        <Card className="p-4">
            <Skeleton className="mb-4 h-8 w-64" />
            <Skeleton className="h-[300px] w-full" />
        </Card>
    );
};

const chartConfig = {
    elo: {
        label: 'ELO',
        color: 'hsl(var(--primary))',
    },
};

export const EloHistoryChart = ({ playerUuid }: EloHistoryChartProps) => {
    const { data: eloHistory, isLoading, error } = useGetPlayerEloHistory(playerUuid);

    if (isLoading) {
        return <EloHistoryChartSkeleton />;
    }

    if (error || !eloHistory) {
        return (
            <Card className="p-4">
                <Typography as="h2" className="mb-4">
                    <Translation>eloHistoryLastYear</Translation>
                </Typography>
                <div className="flex h-32 items-center justify-center">
                    <Typography as="mutedText">
                        <Translation>errorLoadingEloHistory</Translation>
                    </Typography>
                </div>
            </Card>
        );
    }

    if (eloHistory.length === 0) {
        return (
            <Card className="p-4">
                <Typography as="h2" className="mb-4">
                    <Translation>eloHistoryLastYear</Translation>
                </Typography>
                <div className="flex h-32 items-center justify-center">
                    <Typography as="mutedText">
                        <Translation>noGamesInLastYear</Translation>
                    </Typography>
                </div>
            </Card>
        );
    }

    // Group data by day and take the highest ELO for each day
    const dailyEloMap = new Map<string, { maxElo: number; timestamp: number; displayDate: string }>();

    eloHistory.forEach((entry: EloHistoryResponseDTO) => {
        const dateKey = dayjs(entry.timestamp).format('YYYY-MM-DD'); // Group by date
        const timestamp = new Date(entry.timestamp).getTime();
        const existing = dailyEloMap.get(dateKey);

        // Keep the highest ELO for this day
        if (!existing || entry.eloAfter > existing.maxElo) {
            dailyEloMap.set(dateKey, {
                maxElo: entry.eloAfter,
                timestamp: timestamp,
                displayDate: dayjs(entry.timestamp).format('DD.MM.YYYY'),
            });
        }
    });

    // Convert map to array and sort by timestamp
    const chartData: ChartDataPoint[] = Array.from(dailyEloMap.values())
        .map((data) => ({
            timestamp: data.timestamp,
            elo: data.maxElo,
            displayDate: data.displayDate,
        }))
        .sort((a, b) => a.timestamp - b.timestamp);

    // Calculate min and max for better Y-axis scaling
    const eloValues = chartData.map((d) => d.elo);
    const minElo = Math.floor(Math.min(...eloValues) / 50) * 50;
    const maxElo = Math.ceil(Math.max(...eloValues) / 50) * 50;

    // Calculate time domain for proper time-based scaling
    const timeValues = chartData.map((d) => d.timestamp);
    const minTime = Math.min(...timeValues);
    const maxTime = Math.max(...timeValues);

    return (
        <Card className="p-4">
            <Typography as="h2" className="mb-4">
                <Translation>eloHistoryLastYear</Translation>
            </Typography>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="timestamp"
                        type="number"
                        domain={[minTime, maxTime]}
                        scale="time"
                        tickFormatter={(timestamp: number) => dayjs(timestamp).format('MMM D')}
                        className="text-xs"
                    />
                    <YAxis
                        domain={[minElo, maxElo]}
                        className="text-xs"
                        tickFormatter={(value: number) => value.toFixed(0)}
                    />
                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                labelFormatter={(_, payload) => {
                                    if (payload && payload.length > 0) {
                                        const dataPoint = payload[0].payload as ChartDataPoint;
                                        return dataPoint.displayDate;
                                    }
                                    return '';
                                }}
                                formatter={(value) => {
                                    if (typeof value === 'number') {
                                        return value.toFixed(1);
                                    }
                                    return String(value);
                                }}
                            />
                        }
                    />
                    <Line
                        type="monotone"
                        dataKey="elo"
                        stroke="var(--color-elo)"
                        strokeWidth={2}
                        dot={{ fill: 'var(--color-elo)', r: 3 }}
                        activeDot={{ r: 5 }}
                    />
                </LineChart>
            </ChartContainer>
            <Typography as="smallText" className="mt-2 text-muted-foreground">
                <Translation>showingGames</Translation>: {eloHistory.length} (<Translation>daysWithGames</Translation>:{' '}
                {chartData.length})
            </Typography>
        </Card>
    );
};
