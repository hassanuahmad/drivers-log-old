import axios from 'axios';

export const deleteRow = async (url, index) => {
	try {
		const response = await axios.delete(`${url}/${index}`);

		if (response.status === 200 || response.status === 204) {
			return { success: true };
		} else {
			return {
				success: false,
				message: response.statusText || 'An error occurred while deleting the row.'
			};
		}
	} catch (error) {
		if (error.response && error.response.status === 400) {
			return {
				success: false,
				message: error.response.data || 'An error occurred while deleting the row.'
			};
		} else {
			return { success: false, message: 'An error occurred while deleting the row.' };
		}
	}
};
