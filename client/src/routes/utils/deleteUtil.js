import axios from 'axios';

export const deleteRow = async (url, index) => {
	try {
		const response = await axios.delete(`${url}/${index}`);

		if (response.status === 200 || response.status === 204) {
			return true;
		} else {
			console.error('Error deleting row:', response);
			return false;
		}
	} catch (error) {
		console.error(error);
		return false;
	}
};
