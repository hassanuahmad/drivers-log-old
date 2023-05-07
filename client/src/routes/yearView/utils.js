import axios from 'axios';

export const getYearlyData = async (selectedYear) => {
	let lessons = [];
	let uniqueStudentCount;
	let maintenances = [];

	try {
		const response = await axios.get(`http://localhost:3000/yearView/${selectedYear}`);

		lessons = response.data.lessons;
		uniqueStudentCount = response.data.uniqueStudentCount;
		maintenances = response.data.maintenance;

		return [lessons, uniqueStudentCount, maintenances];
	} catch (err) {
		console.error('Error fetching data:', err);
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

// get the total road test "Pass" students
export const getPassedRoadTests = (lessons) => {
	return lessons.filter((lesson) => lesson.roadTest === 'Pass').length;
};

// get the total payment amount
export const getTotalPaymentAmount = (lessons) => {
	const total = lessons.reduce((accumulator, lesson) => {
		return accumulator + parseFloat(lesson.paymentAmount);
	}, 0);

	return total;
};

// get the total payment amount
export const getTotalGasAmount = (maintenance) => {
	const total = maintenance.reduce((accumulator, maintenanceItem) => {
		return accumulator + parseInt(maintenanceItem.gas, 10);
	}, 0);

	return total;
};

// get the total payment amount
export const getTotalMaintenanceAmount = (maintenance) => {
	const total = maintenance.reduce((accumulator, maintenanceItem) => {
		return accumulator + parseInt(maintenanceItem.maintenance, 10);
	}, 0);

	return total;
};
