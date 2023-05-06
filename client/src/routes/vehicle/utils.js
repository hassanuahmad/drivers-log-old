import axios from 'axios';

let vehicleMaintenances = [];

export const getVehicleMaintenance = async (selectedYear, selectedMonth) => {
	const response = await axios.get(
		`http://localhost:3000/vehicleMaintenance/${selectedYear}/${selectedMonth}`
	);

	// sort the data by date
	vehicleMaintenances = response.data.sort((a, b) => {
		const dateA = new Date(a.date).getTime();
		const dateB = new Date(b.date).getTime();
		return dateA - dateB;
	});

	// Calculate gas and maintenance totals
	let gasTotal = 0;
	let maintenanceTotal = 0;

	for (let maintenance of vehicleMaintenances) {
		gasTotal += maintenance.gas;
		maintenanceTotal += maintenance.maintenance;
	}

	return [vehicleMaintenances, gasTotal, maintenanceTotal];
};

// update total after a row is deleted
export const updateTotals = (updatedArray) => {
	let gasTotal = 0;
	let maintenanceTotal = 0;

	for (let maintenance of updatedArray) {
		gasTotal += maintenance.gas;
		maintenanceTotal += maintenance.maintenance;
	}

	return [gasTotal, maintenanceTotal];
};
