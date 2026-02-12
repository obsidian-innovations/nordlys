import { describe, it, expect, vi } from 'vitest';
import { formatTime, formatDateTime, timeAgo } from '$lib/utils/time.js';

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

	describe('boundary transitions', () => {
		it('59 seconds → "just now"', () => {
			const date = new Date(Date.now() - 59 * 1000);
			expect(timeAgo(date)).toBe('just now');
		});

		it('60 seconds → "1m ago"', () => {
			const date = new Date(Date.now() - 60 * 1000);
			expect(timeAgo(date)).toBe('1m ago');
		});

		it('59 minutes → "59m ago"', () => {
			const date = new Date(Date.now() - 59 * 60 * 1000);
			expect(timeAgo(date)).toBe('59m ago');
		});

		it('60 minutes → "1h ago"', () => {
			const date = new Date(Date.now() - 60 * 60 * 1000);
			expect(timeAgo(date)).toBe('1h ago');
		});

		it('23 hours → "23h ago"', () => {
			const date = new Date(Date.now() - 23 * 60 * 60 * 1000);
			expect(timeAgo(date)).toBe('23h ago');
		});

		it('24 hours → "1d ago"', () => {
			const date = new Date(Date.now() - 24 * 60 * 60 * 1000);
			expect(timeAgo(date)).toBe('1d ago');
		});
	});
});

describe('formatDateTime', () => {
	it('outputs a string containing month abbreviation and time', () => {
		const result = formatDateTime(new Date('2025-06-15T14:30:00Z'));
		expect(result).toMatch(/Jun/);
		expect(result).toMatch(/\d{1,2}:\d{2}/);
	});

	it('contains expected day number', () => {
		const result = formatDateTime(new Date('2025-01-05T08:00:00Z'));
		expect(result).toContain('5');
	});
});
