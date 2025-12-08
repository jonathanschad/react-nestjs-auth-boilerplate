import type { EloHistoryResponseDTO } from '@darts/types';
import { Card } from '@darts/ui/components/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@darts/ui/components/chart';
import { Skeleton } from '@darts/ui/components/skeleton';
import { Typography } from '@darts/ui/components/typography';
import { Translation } from '@darts/ui/i18n/Translation';
import dayjs from 'dayjs';
import { Area, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
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
    eloArea: {
        label: 'ELO Range',
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

    // Group data by day and take the last ELO for each day
    const dailyEloMap = new Map<string, { lastElo: number; timestamp: number; displayDate: string }>();

    eloHistory.forEach((entry: EloHistoryResponseDTO) => {
        const dateKey = dayjs(entry.timestamp).format('YYYY-MM-DD'); // Group by date
        const timestamp = new Date(entry.timestamp).getTime();
        const existing = dailyEloMap.get(dateKey);

        // Keep the last ELO for this day (entry with latest timestamp)
        if (!existing || timestamp > existing.timestamp) {
            dailyEloMap.set(dateKey, {
                lastElo: entry.eloAfter,
                timestamp: timestamp,
                displayDate: dayjs(entry.timestamp).format('DD.MM.YYYY'),
            });
        }
    });

    // Convert map to array and sort by timestamp
    const chartData: ChartDataPoint[] = Array.from(dailyEloMap.values())
        .map((data) => ({
            timestamp: data.timestamp,
            elo: data.lastElo,
            displayDate: data.displayDate,
        }))
        .sort((a, b) => a.timestamp - b.timestamp);

    // Calculate min and max for better Y-axis scaling
    const eloValues = chartData.map((d) => d.elo);
    const minElo = Math.floor(Math.min(...eloValues) / 50) * 50;
    const maxElo = Math.ceil(Math.max(...eloValues) / 50) * 50;

    // Fixed time domain: always one year from now
    const now = Date.now();
    const oneYearAgo = now - 1000 * 60 * 60 * 24 * 365;
    const minTime = oneYearAgo;
    const maxTime = now;

    // Calculate evenly distributed ticks for X-axis (not tied to data points)
    const timeRange = maxTime - minTime;
    const tickCount = 6; // Number of ticks on X-axis
    const tickInterval = timeRange / (tickCount - 1);
    const xTicks = Array.from({ length: tickCount }, (_, i) => minTime + i * tickInterval);

    return (
        <Card className="p-6">
            <Typography as="h2" className="mb-6">
                <Translation>eloHistoryLastYear</Translation>
            </Typography>
            <ChartContainer config={chartConfig} className="h-[350px] w-full">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorElo" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-elo)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--color-elo)" stopOpacity={0.05} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" opacity={0.5} />
                    <XAxis
                        dataKey="timestamp"
                        type="number"
                        domain={[minTime, maxTime]}
                        scale="time"
                        ticks={xTicks}
                        tickFormatter={(timestamp: number) => dayjs(timestamp).format('MMM D')}
                        stroke="hsl(var(--muted-foreground))"
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        domain={[minElo, maxElo]}
                        tickFormatter={(value: number) => value.toFixed(0)}
                        stroke="hsl(var(--muted-foreground))"
                        tickLine={false}
                        axisLine={false}
                        width={45}
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
                        cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '3 3' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="elo"
                        stroke="none"
                        fill="url(#colorElo)"
                        fillOpacity={1}
                        isAnimationActive={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="elo"
                        stroke="var(--color-elo)"
                        strokeWidth={3}
                        dot={{
                            fill: 'var(--color-elo)',
                            strokeWidth: 2,
                            r: 4,
                            stroke: 'hsl(var(--background))',
                        }}
                        activeDot={{
                            r: 6,
                            strokeWidth: 2,
                            stroke: 'hsl(var(--background))',
                        }}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ChartContainer>
            <Typography as="smallText" className="mt-4 text-muted-foreground">
                <Translation>showingGames</Translation>: {eloHistory.length} (<Translation>daysWithGames</Translation>:{' '}
                {chartData.length})
            </Typography>
        </Card>
    );
};
