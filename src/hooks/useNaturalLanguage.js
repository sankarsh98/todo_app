// Natural Language Date Parsing Hook
import { useMemo, useCallback } from 'react';
import {
    addDays,
    addWeeks,
    addMonths,
    nextMonday,
    nextTuesday,
    nextWednesday,
    nextThursday,
    nextFriday,
    nextSaturday,
    nextSunday,
    setHours,
    setMinutes,
    startOfDay,
    parse,
    isValid,
    setYear,
    getYear
} from 'date-fns';

/**
 * Hook for parsing natural language task input
 * Extracts dates, priorities, labels, time, and recurring patterns from text
 */
export const useNaturalLanguage = () => {

    // Month name mappings
    const monthNames = useMemo(() => ({
        'jan': 0, 'january': 0,
        'feb': 1, 'february': 1,
        'mar': 2, 'march': 2,
        'apr': 3, 'april': 3,
        'may': 4,
        'jun': 5, 'june': 5,
        'jul': 6, 'july': 6,
        'aug': 7, 'august': 7,
        'sep': 8, 'sept': 8, 'september': 8,
        'oct': 9, 'october': 9,
        'nov': 10, 'november': 10,
        'dec': 11, 'december': 11,
    }), []);

    // Day of week patterns
    const dayOfWeekPatterns = useMemo(() => [
        { pattern: /\b(next\s+)?monday\b/i, getValue: () => startOfDay(nextMonday(new Date())) },
        { pattern: /\b(next\s+)?tuesday\b/i, getValue: () => startOfDay(nextTuesday(new Date())) },
        { pattern: /\b(next\s+)?wednesday\b/i, getValue: () => startOfDay(nextWednesday(new Date())) },
        { pattern: /\b(next\s+)?thursday\b/i, getValue: () => startOfDay(nextThursday(new Date())) },
        { pattern: /\b(next\s+)?friday\b/i, getValue: () => startOfDay(nextFriday(new Date())) },
        { pattern: /\b(next\s+)?saturday\b/i, getValue: () => startOfDay(nextSaturday(new Date())) },
        { pattern: /\b(next\s+)?sunday\b/i, getValue: () => startOfDay(nextSunday(new Date())) },
    ], []);

    // Date patterns
    const datePatterns = useMemo(() => [
        { pattern: /\btoday\b/i, getValue: () => startOfDay(new Date()) },
        { pattern: /\btomorrow\b/i, getValue: () => startOfDay(addDays(new Date(), 1)) },
        { pattern: /\byesterday\b/i, getValue: () => startOfDay(addDays(new Date(), -1)) },
        { pattern: /\bnext week\b/i, getValue: () => startOfDay(addWeeks(new Date(), 1)) },
        { pattern: /\bnext month\b/i, getValue: () => startOfDay(addMonths(new Date(), 1)) },
        { pattern: /\bin (\d+) days?\b/i, getValue: (match) => startOfDay(addDays(new Date(), parseInt(match[1]))) },
        { pattern: /\bin (\d+) weeks?\b/i, getValue: (match) => startOfDay(addWeeks(new Date(), parseInt(match[1]))) },
        { pattern: /\bin (\d+) months?\b/i, getValue: (match) => startOfDay(addMonths(new Date(), parseInt(match[1]))) },
    ], []);

    // Recurring patterns - detect cyclical language
    const recurringPatterns = useMemo(() => [
        { pattern: /\bevery\s*day\b|\bdaily\b/i, value: { frequency: 'daily', interval: 1 } },
        { pattern: /\bevery\s*week\b|\bweekly\b/i, value: { frequency: 'weekly', interval: 1 } },
        { pattern: /\bevery\s*month\b|\bmonthly\b/i, value: { frequency: 'monthly', interval: 1 } },
        { pattern: /\bevery\s*year\b|\byearly\b|\bannually\b/i, value: { frequency: 'yearly', interval: 1 } },
        { pattern: /\bevery\s*(\d+)\s*days?\b/i, value: (match) => ({ frequency: 'daily', interval: parseInt(match[1]) }) },
        { pattern: /\bevery\s*(\d+)\s*weeks?\b/i, value: (match) => ({ frequency: 'weekly', interval: parseInt(match[1]) }) },
        { pattern: /\bevery\s*(\d+)\s*months?\b/i, value: (match) => ({ frequency: 'monthly', interval: parseInt(match[1]) }) },
        { pattern: /\bevery\s*monday\b/i, value: { frequency: 'weekly', interval: 1, dayOfWeek: 1 } },
        { pattern: /\bevery\s*tuesday\b/i, value: { frequency: 'weekly', interval: 1, dayOfWeek: 2 } },
        { pattern: /\bevery\s*wednesday\b/i, value: { frequency: 'weekly', interval: 1, dayOfWeek: 3 } },
        { pattern: /\bevery\s*thursday\b/i, value: { frequency: 'weekly', interval: 1, dayOfWeek: 4 } },
        { pattern: /\bevery\s*friday\b/i, value: { frequency: 'weekly', interval: 1, dayOfWeek: 5 } },
        { pattern: /\bevery\s*saturday\b/i, value: { frequency: 'weekly', interval: 1, dayOfWeek: 6 } },
        { pattern: /\bevery\s*sunday\b/i, value: { frequency: 'weekly', interval: 1, dayOfWeek: 0 } },
        { pattern: /\bweekdays\b|\bevery\s*weekday\b/i, value: { frequency: 'weekday', interval: 1 } },
        { pattern: /\bweekends\b|\bevery\s*weekend\b/i, value: { frequency: 'weekend', interval: 1 } },
    ], []);

    // Priority patterns
    const priorityPatterns = useMemo(() => [
        { pattern: /!{3,}|p1|priority\s*1|high\s*priority|urgent/i, value: 1 },
        { pattern: /!!|p2|priority\s*2|medium\s*priority/i, value: 2 },
        { pattern: /!|p3|priority\s*3|low\s*priority/i, value: 3 },
    ], []);

    // Label pattern - matches #labelname
    const labelPattern = /#(\w+)/g;

    /**
     * Parse date in format "26 jan", "10 sept 2025", "jan 26", etc.
     */
    const parseDateWithMonth = useCallback((input) => {
        // Pattern: "26 jan", "26 january", "26 jan 2025"
        const dayFirstPattern = /\b(\d{1,2})\s+(jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|sept|september|oct|october|nov|november|dec|december)(?:\s+(\d{4}))?\b/i;

        // Pattern: "jan 26", "january 26", "jan 26 2025"
        const monthFirstPattern = /\b(jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|sept|september|oct|october|nov|november|dec|december)\s+(\d{1,2})(?:st|nd|rd|th)?(?:\s+(\d{4}))?\b/i;

        let match = input.match(dayFirstPattern);
        if (match) {
            const day = parseInt(match[1]);
            const monthName = match[2].toLowerCase();
            const year = match[3] ? parseInt(match[3]) : getYear(new Date());
            const month = monthNames[monthName];

            if (month !== undefined && day >= 1 && day <= 31) {
                let date = new Date(year, month, day);
                // If date is in the past and no year specified, use next year
                if (!match[3] && date < new Date()) {
                    date = setYear(date, year + 1);
                }
                return { date: startOfDay(date), matched: match[0] };
            }
        }

        match = input.match(monthFirstPattern);
        if (match) {
            const monthName = match[1].toLowerCase();
            const day = parseInt(match[2]);
            const year = match[3] ? parseInt(match[3]) : getYear(new Date());
            const month = monthNames[monthName];

            if (month !== undefined && day >= 1 && day <= 31) {
                let date = new Date(year, month, day);
                // If date is in the past and no year specified, use next year
                if (!match[3] && date < new Date()) {
                    date = setYear(date, year + 1);
                }
                return { date: startOfDay(date), matched: match[0] };
            }
        }

        return null;
    }, [monthNames]);

    /**
     * Extract time from input - supports @3pm, @3:30pm, 3.30pm, at 3pm, at 2.30, etc.
     */
    const extractTime = useCallback((input) => {
        // Multiple time patterns to match - supporting both : and . as separators
        const patterns = [
            // @3pm, @3:30pm, @3.30pm, @15:30, @2.30
            /@(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm)?/i,
            // at 3pm, at 3:30pm, at 3.30pm, at 2.30
            /\bat\s+(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm)?/i,
            // 3:30pm, 3.30pm, 2:30am (with separator and am/pm)
            /\b(\d{1,2})[:.](\d{2})\s*(am|pm)\b/i,
            // 3pm, 9am (whole hour with am/pm)
            /\b(\d{1,2})\s*(am|pm)\b/i,
        ];

        for (const regex of patterns) {
            const match = input.match(regex);
            if (match) {
                let hours = parseInt(match[1]);
                // Handle case where am/pm is in position 2 (whole hour pattern like "3pm")
                const secondGroup = match[2];
                const thirdGroup = match[3];

                let minutes = 0;
                let period = null;

                if (secondGroup && ['am', 'pm'].includes(secondGroup.toLowerCase())) {
                    // Pattern: 3pm (am/pm in position 2)
                    period = secondGroup.toLowerCase();
                } else if (secondGroup) {
                    // Pattern: 3:30pm or 3.30pm (minutes in position 2)
                    minutes = parseInt(secondGroup);
                    period = thirdGroup?.toLowerCase();
                } else {
                    period = thirdGroup?.toLowerCase();
                }

                // Handle 12-hour format
                if (period === 'pm' && hours < 12) hours += 12;
                if (period === 'am' && hours === 12) hours = 0;

                // If no am/pm and hours <= 12, assume based on context
                if (!period && hours >= 1 && hours <= 12) {
                    // Assume PM for times between 1-6, AM for 7-11
                    if (hours >= 1 && hours <= 6) {
                        hours += 12;
                    }
                }

                // Validate hours and minutes
                if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
                    return {
                        time: { hours, minutes },
                        matched: match[0]
                    };
                }
            }
        }
        return null;
    }, []);

    /**
     * Extract recurring pattern from input
     */
    const extractRecurring = useCallback((input) => {
        for (const { pattern, value } of recurringPatterns) {
            const match = input.match(pattern);
            if (match) {
                const recurring = typeof value === 'function' ? value(match) : value;
                return { recurring, matched: match[0] };
            }
        }
        return null;
    }, [recurringPatterns]);

    /**
     * Parse natural language input and extract structured data
     */
    const parseInput = useCallback((input, availableLabels = []) => {
        let title = input;
        let dueDate = null;
        let priority = 4;
        let labels = [];
        let time = null;
        let hasReminder = false;
        let recurring = null;

        // Extract recurring pattern first
        const recurringResult = extractRecurring(input);
        if (recurringResult) {
            recurring = recurringResult.recurring;
            title = title.replace(recurringResult.matched, '').trim();
            if (!dueDate) {
                dueDate = startOfDay(new Date());
            }
        }

        // Extract time
        const timeResult = extractTime(input);
        if (timeResult) {
            time = timeResult.time;
            title = title.replace(timeResult.matched, '').trim();
            hasReminder = true;
        }

        // Try parsing "26 jan" or "jan 26" format
        const monthDateResult = parseDateWithMonth(input);
        if (monthDateResult) {
            dueDate = monthDateResult.date;
            title = title.replace(monthDateResult.matched, '').trim();
        }

        // Try keyword patterns
        if (!dueDate) {
            for (const { pattern, getValue } of datePatterns) {
                const match = input.match(pattern);
                if (match) {
                    dueDate = getValue(match);
                    title = title.replace(pattern, '').trim();
                    break;
                }
            }
        }

        // Try day of week patterns
        if (!dueDate) {
            for (const { pattern, getValue } of dayOfWeekPatterns) {
                const match = input.match(pattern);
                if (match) {
                    dueDate = getValue(match);
                    title = title.replace(pattern, '').trim();
                    break;
                }
            }
        }

        // Try explicit date formats
        if (!dueDate) {
            const explicitDatePatterns = [
                { regex: /(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?/, format: 'MM/dd/yyyy' },
                { regex: /(\d{4})-(\d{2})-(\d{2})/, format: 'yyyy-MM-dd' },
            ];

            for (const { regex, format } of explicitDatePatterns) {
                const match = input.match(regex);
                if (match) {
                    const dateStr = match[0];
                    const year = match[3] || new Date().getFullYear();
                    const fullDateStr = match[3] ? dateStr : `${dateStr}/${year}`;
                    const parsed = parse(fullDateStr, format, new Date());
                    if (isValid(parsed)) {
                        dueDate = startOfDay(parsed);
                        title = title.replace(regex, '').trim();
                        break;
                    }
                }
            }
        }

        // Apply time to date if both exist
        if (dueDate && time) {
            dueDate = setMinutes(setHours(dueDate, time.hours), time.minutes);
        } else if (time && !dueDate) {
            dueDate = setMinutes(setHours(startOfDay(new Date()), time.hours), time.minutes);
        }

        // Extract priority
        for (const { pattern, value } of priorityPatterns) {
            if (pattern.test(input)) {
                priority = value;
                title = title.replace(pattern, '').trim();
                break;
            }
        }

        // Extract labels
        let labelMatch;
        const labelRegex = new RegExp(labelPattern.source, 'g');
        while ((labelMatch = labelRegex.exec(input)) !== null) {
            const labelName = labelMatch[1].toLowerCase();
            const matchedLabel = availableLabels.find(
                l => l.name.toLowerCase() === labelName
            );
            if (matchedLabel) {
                labels.push(matchedLabel.id);
            }
            title = title.replace(labelMatch[0], '').trim();
        }

        // Clean up title
        title = title.replace(/\s+/g, ' ').trim();

        return {
            title,
            dueDate,
            priority,
            labels,
            hasReminder,
            recurring,
        };
    }, [datePatterns, dayOfWeekPatterns, priorityPatterns, parseDateWithMonth, extractTime, extractRecurring]);

    /**
     * Get date suggestion based on partial input
     */
    const getDateSuggestions = useCallback((input) => {
        const lowerInput = input.toLowerCase();
        const suggestions = [];

        if ('today'.includes(lowerInput)) {
            suggestions.push({ label: 'Today', date: startOfDay(new Date()) });
        }
        if ('tomorrow'.includes(lowerInput)) {
            suggestions.push({ label: 'Tomorrow', date: startOfDay(addDays(new Date(), 1)) });
        }
        if ('next week'.includes(lowerInput)) {
            suggestions.push({ label: 'Next week', date: startOfDay(addWeeks(new Date(), 1)) });
        }

        return suggestions;
    }, []);

    return {
        parseInput,
        getDateSuggestions,
    };
};

export default useNaturalLanguage;
