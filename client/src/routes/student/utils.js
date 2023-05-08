import axios from 'axios';

export const getStudents = async () => {
	let students = [];

	try {
		const response = await axios.get('http://localhost:3000/student');
		students = response.data;
	} catch (error) {
		console.error('Error fetching students:', error);
	}

	return students;
};
