/** Format a date as "HH:MM" in local time */
export function formatTime(date: Date): string {
	return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

/** Format a date as "Mon DD, HH:MM" */
export function formatDateTime(date: Date): string {
	return date.toLocaleDateString('en-GB', {
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}

/** How long ago — "2m ago", "1h ago", etc. */
export function timeAgo(date: Date): string {
	const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
	if (seconds < 60) return 'just now';
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.floor(hours / 24);
	return `${days}d ago`;
}
