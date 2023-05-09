import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
	getYearlyData,
	getTotalDuration,
	getPassedRoadTests,
	getTotalPaymentAmount,
	getTotalGasAmount,
	getTotalMaintenanceAmount
} from './utils';

// Initialize axios mock adapter
const mockAxios = new MockAdapter(axios);

describe('getYearlyData', () => {
	afterEach(() => {
		mockAxios.reset();
	});

	it('should return the correct data from the API', async () => {
		const mockData = {
			lessons: [{ duration: '1h 30m', paymentAmount: '50', roadTest: 'Pass' }],
			uniqueStudentCount: 1,
			maintenance: [{ gas: '20', maintenance: '30' }]
		};
		mockAxios.onGet('http://localhost:3000/yearView/2023').reply(200, mockData);

		const [lessons, uniqueStudentCount, maintenances] = await getYearlyData(2023);

		expect(lessons).toEqual(mockData.lessons);
		expect(uniqueStudentCount).toEqual(mockData.uniqueStudentCount);
		expect(maintenances).toEqual(mockData.maintenance);
	});

	it('should handle API errors', async () => {
		mockAxios.onGet('http://localhost:3000/yearView/2023').reply(500);

		const consoleErrorSpy = jest.spyOn(console, 'error');
		consoleErrorSpy.mockImplementation(() => {});

		const result = await getYearlyData(2023);

		expect(result).toBeUndefined();

		consoleErrorSpy.mockRestore();
	});
});

describe('getTotalDuration', () => {
	it('should return the correct total duration', () => {
		const lessons = [{ duration: '1h 30m' }, { duration: '2h 15m' }];
		const result = getTotalDuration(lessons);
		expect(result).toBe('3h 45m');
	});
});

describe('getPassedRoadTests', () => {
	it('should return the correct number of passed road tests', () => {
		const lessons = [{ roadTest: 'Pass' }, { roadTest: 'Fail' }, { roadTest: 'Pass' }];
		const result = getPassedRoadTests(lessons);
		expect(result).toBe(2);
	});
});

describe('getTotalPaymentAmount', () => {
	it('should return the correct total payment amount', () => {
		const lessons = [{ paymentAmount: '50' }, { paymentAmount: '25' }, { paymentAmount: '30' }];
		const result = getTotalPaymentAmount(lessons);
		expect(result).toBe(105);
	});
});

describe('getTotalGasAmount', () => {
	it('should return the correct total gas amount', () => {
		const maintenance = [{ gas: '20' }, { gas: '30' }, { gas: '10' }];
		const result = getTotalGasAmount(maintenance);
		expect(result).toBe(60);
	});
});

describe('getTotalMaintenanceAmount', () => {
	it('should return the correct total maintenance amount', () => {
		const maintenance = [{ maintenance: '40' }, { maintenance: '30' }, { maintenance: '20' }];
		const result = getTotalMaintenanceAmount(maintenance);
		expect(result).toBe(90);
	});
});
