import { describe, it, expect } from 'vitest';
import { formatTime, timeAgo } from '$lib/utils/time.js';

describe('formatTime', () => {
	it('formats as HH:MM', () => {
		const result = formatTime(new Date('2025-01-15T14:30:00Z'));
		// Will vary by locale, but should contain numbers
		expect(result).toMatch(/\d{1,2}:\d{2}/);
	});
});

describe('timeAgo', () => {
	it('returns "just now" for recent dates', () => {
		expect(timeAgo(new Date())).toBe('just now');
	});

	it('returns minutes for recent past', () => {
		const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
		expect(timeAgo(fiveMinAgo)).toBe('5m ago');
	});

	it('returns hours for older dates', () => {
		const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
		expect(timeAgo(twoHoursAgo)).toBe('2h ago');
	});

	it('returns days for very old dates', () => {
		const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
		expect(timeAgo(threeDaysAgo)).toBe('3d ago');
	});
});
