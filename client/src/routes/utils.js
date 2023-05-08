import axios from 'axios';
import { writable } from 'svelte/store';

// this lets the view.svelte component know when to refresh the lessons becuase the user added a new lesson
export const refreshLessons = writable(false);

export const getLessons = async (selectedYear, selectedMonth) => {
	let lessons = [];

	try {
		const response = await axios.get(`http://localhost:3000/${selectedYear}/${selectedMonth}`);
		lessons = response.data || [];

		// Sort lessons by date and if the date is the same, sort by time
		lessons
			.sort((a, b) => {
				const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
				if (dateComparison !== 0) {
					return dateComparison;
				} else {
					const timeA = a.startTime.split(':').map(Number);
					const timeB = b.startTime.split(':').map(Number);
					if (timeB[0] !== timeA[0]) {
						return timeB[0] - timeA[0];
					} else {
						return timeB[1] - timeA[1];
					}
				}
			})
			.reverse();

		return lessons;
	} catch (error) {
		console.error(error);
	}
};

// get the total duration of all lessons
export const getTotalDuration = (lessons) => {
	let totalMinutes = 0;

	for (let lesson of lessons) {
		const [hours, minutes] = lesson.duration.split(' ');

		totalMinutes += Number(hours.replace('h', '')) * 60 + Number(minutes.replace('m', ''));
	}

	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;

	return `${hours}h ${minutes}m`;
};

export const getPaymentTypeTotals = (lessons) => {
	let cashAmount = 0;
	let interacAmount = 0;

	lessons.forEach((lesson) => {
		if (lesson.paymentType === 'Cash') {
			cashAmount += parseFloat(lesson.paymentAmount);
		} else if (lesson.paymentType === 'Interac') {
			interacAmount += parseFloat(lesson.paymentAmount);
		}
	});

	return { cashAmount, interacAmount };
};
