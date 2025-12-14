// Helper function to format week as "KW43"
export const formatWeek = (date: Date): string => {
    const d = new Date(date);
    // Get ISO week number
    const tempDate = new Date(d.getTime());
    tempDate.setHours(0, 0, 0, 0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay() || 7));
    // Get first day of year
    const yearStart = new Date(tempDate.getFullYear(), 0, 1);
    // Calculate full weeks to nearest Thursday
    const weekNo = Math.ceil(((tempDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    return `KW${weekNo}`;
};
