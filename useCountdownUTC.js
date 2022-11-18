import { useEffect, useState } from 'react';

export const useCountdownUTC = (year, month, day, hour = 0, minute = 0) => {
    
	const [daysLeft , setDaysLeft ] = useState(null);
	const [hoursLeft, setHoursLeft] = useState(null);
	const [minsLeft , setMinsLeft ] = useState(null);
	const [secsLeft , setSecsLeft ] = useState(null);
	const [finished , setFinished ] = useState(false);

	useEffect(() => {
		const interval = setInterval(() => {

			const target 	= new Date(year, month - 1, day, hour, minute, 0).getTime() / 1000;
			const offset 	= new Date().getTimezoneOffset() * 60;
			const now 		= new Date().getTime() / 1000 + offset;
			const totalSecs = Math.trunc(target - now);

			setFinished (totalSecs <= 0);
			setDaysLeft (days(totalSecs));
			setHoursLeft(hours(totalSecs));
			setMinsLeft (mins(totalSecs));
			setSecsLeft (secs(totalSecs));
			
		}, 1000);

		return () => clearInterval(interval);
	}, []);

    const days  = (totalSecs) =>
        Math.trunc( totalSecs / secsInDay)

    const hours = (totalSecs) =>
        Math.trunc((totalSecs - days(totalSecs) * secsInDay) / secsInHour);

    const mins  = (totalSecs) =>
        Math.trunc((totalSecs - days(totalSecs) * secsInDay - hours(totalSecs) * secsInHour) / secsInMin);

    const secs  = (totalSecs) =>
        Math.trunc( totalSecs - days(totalSecs) * secsInDay - hours(totalSecs) * secsInHour - mins(totalSecs) * secsInMin);

    return {
        days: pad(daysLeft), hours: pad(hoursLeft), mins: pad(minsLeft), secs: pad(secsLeft),
		finished,
    }
}

const secsInDay = 24 * 60 * 60;
const secsInHour = 60 * 60;
const secsInMin = 60;

const pad = (value) => {
	const v = value?.toString();
	return (v?.length === 1) ? '0' + v : v
}
