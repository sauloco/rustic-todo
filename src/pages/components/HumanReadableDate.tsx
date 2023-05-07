import React, {useEffect, useState} from 'react';

interface HumanReadableDateProps {
	date: Date,
	prefix?: string,
	fromDiff?: Date,
}

const HumanReadableDate: React.FC<HumanReadableDateProps> = ({date, prefix, fromDiff}) => {

	const [humanReadableDate, setHumanReadableDate] = useState<string>('')
	const [currentTime, setCurrentTime] = useState(Date.now());
	const [readableDate, setReadableDate] = useState('');

	useEffect(() => {
		setInterval(() => {
			setCurrentTime(Date.now())
		}, 1000 * 10)
	}, [])

	useEffect(() => {
		const diff = date.getTime() - (fromDiff?.getTime() || Date.now());

		const formatter = new Intl.RelativeTimeFormat('en', {
			numeric: 'auto',
			style: 'long',
			localeMatcher: 'best fit'
		});

		const readableDate = new Date(date).toLocaleDateString();
		const readableTime = new Date(date).toLocaleTimeString().replaceAll(':00', '');
		setReadableDate(`${readableDate} ${readableTime}`)

		const units = {
			'day': 24 * 60 * 60 * 1000,
			'hour': 60 * 60 * 1000,
			'minute': 60 * 1000,
			'second': 1000,
		};

		for (const [unit, factor] of Object.entries(units)) {
			const amount = Math.round(diff / factor)
			if (Math.abs(amount) >= 1) {
				let readable = formatter.format(amount, unit as "year" | "years" | "quarter" | "quarters" | "month" | "months" | "week" | "weeks" | "day" | "days" | "hour" | "hours" | "minute" | "minutes" | "second" | "seconds");
				if (['today', 'tomorrow'].includes(readable)) {
					readable = `${readable}, ${readableTime}`
				}
				setHumanReadableDate(readable)
				return;
			}
		}
		setHumanReadableDate('now')
	}, [date, fromDiff, currentTime])

	return (
		<p title={readableDate}>
			{prefix ? <span>{prefix}&nbsp;</span> : null}
			<time dateTime={date.toISOString()}>{humanReadableDate}</time>
		</p>
	)
}

export default HumanReadableDate