// TODO add year functionality? Or day?
export function getDateNumberKey(dateType: 'month' | 'week'): 'month_number' | 'week_number' {
    return `${dateType}_number` as 'month_number' | 'week_number';
}