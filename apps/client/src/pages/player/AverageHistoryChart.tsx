import type { AverageObjectDTO } from '@darts/types';
import { Card } from '@darts/ui/components/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@darts/ui/components/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@darts/ui/components/select';
import { Skeleton } from '@darts/ui/components/skeleton';
import { Typography } from '@darts/ui/components/typography';
import { Translation } from '@darts/ui/i18n/Translation';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { useState } from 'react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { useGetPlayerAverageHistory } from '@/api/dart/player/useGetPlayerAverageHistory';

dayjs.extend(weekOfYear);

const chartConfig = {
    desktop: {
        label: 'Desktop',
        color: 'var(--chart-1)',
    },
    mobile: {
        label: 'Mobile',
        color: 'var(--chart-2)',
    },
} satisfies ChartConfig;

type DataPoint = {
    date: string;
    average: number;
    scoringAverage: number;
    numberOfGames: number;
};

type AverageHistoryChartProps = {
    playerUuid: string;
};

export const AverageHistoryChartSkeleton = () => {
    return (
        <Card className="p-4">
            <Skeleton className="mb-4 h-8 w-64" />
            <Skeleton className="h-[300px] w-full" />
        </Card>
    );
};

export const AverageHistoryChart = ({ playerUuid }: AverageHistoryChartProps) => {
    const [mode, setMode] = useState<'day' | 'week' | 'month'>('day');
    const { data: averageHistory, isLoading, error } = useGetPlayerAverageHistory(playerUuid);

    if (isLoading) {
        return <AverageHistoryChartSkeleton />;
    }

    if (error || !averageHistory) {
        return (
            <Card className="p-4">
                <Typography as="h2" className="mb-4">
                    <Translation>dailyAverages</Translation>
                </Typography>
                <div className="flex h-32 items-center justify-center">
                    <Typography as="mutedText">
                        <Translation>errorLoadingAverageHistory</Translation>
                    </Typography>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-4">
            <div className="mb-4 flex items-center justify-between">
                <Typography as="h2">
                    <Translation>dailyAverages</Translation>
                </Typography>
                <Select value={mode} onValueChange={(value) => setMode(value as 'day' | 'week' | 'month')}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="day">
                            <Translation>day</Translation>
                        </SelectItem>
                        <SelectItem value="week">
                            <Translation>week</Translation>
                        </SelectItem>
                        <SelectItem value="month">
                            <Translation>month</Translation>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <AverageBarChart data={averageHistory.dailyAverages} mode={mode} />
        </Card>
    );
};

const CustomTooltip = ({
    active,
    payload,
    mode,
}: {
    active?: boolean;
    payload?: [{ payload: DataPoint }];
    mode: 'day' | 'week' | 'month';
}) => {
    if (!active || !payload || !payload.length) {
        return null;
    }

    const data = payload[0].payload;
    const date = dayjs(data.date);

    let dateFormat = 'DD MMM YYYY';
    if (mode === 'week') {
        const weekStart = date.startOf('week');
        const weekEnd = date.endOf('week');
        dateFormat = `${weekStart.format('DD MMM')} - ${weekEnd.format('DD MMM YYYY')}`;
    } else if (mode === 'month') {
        dateFormat = 'MMM YYYY';
    }

    return (
        <Card className="p-3">
            <Typography as="p" className="mb-2 font-semibold">
                {mode === 'week' ? dateFormat : date.format(dateFormat)}
            </Typography>
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: 'var(--chart-2)' }} />
                    <Typography as="smallText">
                        <Translation>Average</Translation> {data.average.toFixed(2)}
                    </Typography>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: 'var(--chart-5)' }} />
                    <Typography as="smallText">
                        <Translation>Scoring Average</Translation> {data.scoringAverage.toFixed(2)}
                    </Typography>
                </div>
                <div className="mt-2 pt-2 border-t">
                    <Typography as="smallText" className="text-muted-foreground">
                        <Translation>gamesPlayed</Translation> {data.numberOfGames}
                    </Typography>
                </div>
            </div>
        </Card>
    );
};

const AverageBarChart = ({
    data,
    mode,
}: {
    data: Record<string, AverageObjectDTO>;
    mode: 'day' | 'week' | 'month';
}) => {
    const chartDataUncombined = Object.entries(data)
        .map(([date, average]) => ({
            startDate: dayjs(date).startOf(mode),
            endDate: dayjs(date).endOf(mode),
            average: average.average,
            scoringAverage: average.scoringAverage,
            numberOfGames: average.numberOfGames,
        }))
        .sort((a, b) => a.startDate.diff(b.startDate));

    const startDate = dayjs().subtract(30, mode);
    const endDate = dayjs();

    let loopDate = startDate;
    const chartDataGrouped: Record<string, AverageObjectDTO[]> = {};

    while (!loopDate.isAfter(endDate, mode)) {
        const currentDate = loopDate.startOf(mode);
        chartDataGrouped[currentDate.format('YYYY-MM-DD')] = [];
        loopDate = loopDate.add(1, mode);
    }

    for (const average of chartDataUncombined) {
        chartDataGrouped[average.startDate.format('YYYY-MM-DD')].push(average);
    }
    const chartDataCombined: DataPoint[] = Object.entries(chartDataGrouped).map(([date, averages]) => {
        const numberOfGames = averages.reduce((acc, average) => acc + average.numberOfGames, 0);
        let average = 0;
        let scoringAverage = 0;
        if (numberOfGames > 0) {
            average =
                averages.reduce((acc, average) => acc + average.average * average.numberOfGames, 0) / numberOfGames;
            scoringAverage =
                averages.reduce((acc, average) => acc + average.scoringAverage * average.numberOfGames, 0) /
                numberOfGames;
        }
        return {
            date: date,
            average,
            scoringAverage,
            numberOfGames: numberOfGames,
        };
    });

    return (
        <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
            <BarChart accessibilityLayer data={chartDataCombined}>
                <Bar dataKey="scoringAverage" xAxisId="b" fill="var(--chart-5)" radius={[8, 8, 0, 0]} barSize={32} />
                <Bar
                    dataKey="average"
                    xAxisId="a"
                    fill="var(--chart-2)"
                    radius={[8, 8, 0, 0]}
                    barSize={16}
                    opacity={0.9}
                />
                <XAxis
                    xAxisId="a"
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                        const date = dayjs(value as string);
                        return date.format(mode === 'month' ? 'MMM YYYY' : 'DD MMM');
                    }}
                />
                <XAxis xAxisId="b" dataKey="date" tickMargin={16} minTickGap={32} hide={true} />
                <YAxis
                    tickFormatter={(value: number) => value.toFixed(0)}
                    tickLine={false}
                    axisLine={false}
                    width={45}
                />
                <ChartTooltip cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }} content={<CustomTooltip mode={mode} />} />
            </BarChart>
        </ChartContainer>
    );
};
