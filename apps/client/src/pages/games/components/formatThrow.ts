export const formatThrow = ({ value, multiplier }: { value: number | null; multiplier: number | null }) => {
    if (value === null || multiplier === null) return '-';
    if (value === 0) return 'Miss';
    const multiplierStr = multiplier === 1 ? '' : multiplier === 2 ? 'D' : 'T';
    return `${multiplierStr}${value}`;
};
