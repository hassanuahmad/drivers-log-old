import axios from 'axios';

export const getStudents = async () => {
	let students = [];

	const response = await axios.get('http://localhost:3000/student');
	students = response.data;

	return students;
};
