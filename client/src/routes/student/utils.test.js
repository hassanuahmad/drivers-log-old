import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getStudents } from './utils';

const mockAxios = new MockAdapter(axios);

describe('getStudents', () => {
	afterEach(() => {
		mockAxios.reset();
	});

	it('should return students data when API call is successful', async () => {
		const mockStudents = [
			{ id: 1, name: 'John Doe', age: 25 },
			{ id: 2, name: 'Jane Smith', age: 22 }
		];

		mockAxios.onGet('http://localhost:3000/student').reply(200, mockStudents);

		const students = await getStudents();

		expect(students).toEqual(mockStudents);
	});

	it('should return an empty array when API call fails', async () => {
		// Temporarily mock console.error to suppress output so it doesn't clutter the test results
		const consoleErrorSpy = jest.spyOn(console, 'error');
		consoleErrorSpy.mockImplementation(() => {});

		mockAxios.onGet('http://localhost:3000/student').reply(500);

		const students = await getStudents();

		expect(students).toEqual([]);

		// Restore the original console.error function after the test
		consoleErrorSpy.mockRestore();
	});
});
