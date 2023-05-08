import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { deleteRow } from './deleteUtil';

const mock = new MockAdapter(axios);

describe('deleteRow', () => {
	afterEach(() => {
		mock.reset();
	});

	it('should successfully delete the row', async () => {
		const url = 'http://localhost:3000/test';
		const index = 1;
		mock.onDelete(`${url}/${index}`).reply(204);

		const result = await deleteRow(url, index);
		expect(result).toEqual({ success: true });
	});

	it('should return an error when deletion fails', async () => {
		const url = 'http://localhost:3000/test';
		const index = 1;
		mock.onDelete(`${url}/${index}`).reply(400, 'Bad Request');

		const result = await deleteRow(url, index);
		expect(result).toEqual({ success: false, message: 'Bad Request' });
	});

	it('should return a generic error message when an error occurs', async () => {
		const url = 'http://localhost:3000/test';
		const index = 1;
		mock.onDelete(`${url}/${index}`).networkError();

		const result = await deleteRow(url, index);
		expect(result).toEqual({
			success: false,
			message: 'An error occurred while deleting the row.'
		});
	});
});
