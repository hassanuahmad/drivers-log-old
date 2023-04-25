<script>
	import axios from 'axios';
	import { onMount } from 'svelte';

	let vehicleMaintenances = [];
	let gasTotal = 0;
	let maintenanceTotal = 0;

	const getVehicleMaintenance = async () => {
		const response = await axios.get('http://localhost:3000/vehicleMaintenance');
		vehicleMaintenances = response.data;

		// Calculate gas and maintenance totals
		for (let maintenance of vehicleMaintenances) {
			gasTotal += maintenance.gas;
			maintenanceTotal += maintenance.maintenance;
		}
	};

	onMount(() => {
		getVehicleMaintenance();
	});
</script>

<div class="flex flex-col">
	<div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
		<div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
			<div class="overflow-hidden">
				<table class="min-w-full text-left text-sm font-light">
					<thead class="border-b font-medium dark:border-neutral-500">
						<tr>
							<th scope="col" class="px-6 py-4">#</th>
							<th scope="col" class="px-6 py-4">Date</th>
							<th scope="col" class="px-6 py-4">Odometer</th>
							<th scope="col" class="px-6 py-4">Fueling</th>
							<th scope="col" class="px-6 py-4">Gas</th>
							<th scope="col" class="px-6 py-4">Maintenance</th>
							<th scope="col" class="px-6 py-4">Remarks</th>
						</tr>
					</thead>
					<tbody>
						{#each vehicleMaintenances as vehicleMaintenance}
							<tr
								class="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-300"
							>
								<td class="whitespace-nowrap px-6 py-4 font-medium">{vehicleMaintenance.id}</td>
								<td class="whitespace-nowrap px-6 py-4">{vehicleMaintenance.date}</td>
								<td class="whitespace-nowrap px-6 py-4">{vehicleMaintenance.odometer}</td>
								<td class="whitespace-nowrap px-6 py-4">{vehicleMaintenance.fueling}</td>
								<td class="whitespace-nowrap px-6 py-4">${vehicleMaintenance.gas}</td>
								<td class="whitespace-nowrap px-6 py-4">${vehicleMaintenance.maintenance}</td>
								<td class="whitespace-nowrap px-6 py-4">{vehicleMaintenance.remarks}</td>
							</tr>
						{/each}
						<tr>
							<td class="whitespace-nowrap px-6 py-4 font-medium" />
							<td class="whitespace-nowrap px-6 py-4 font-medium" />
							<td class="whitespace-nowrap px-6 py-4 font-medium" />
							<td class="whitespace-nowrap px-6 py-4 font-medium" />
							<td class="whitespace-nowrap px-6 py-4 font-medium text-indigo-600">${gasTotal}</td>
							<td class="whitespace-nowrap px-6 py-4 font-medium text-indigo-600"
								>${maintenanceTotal}</td
							>
							<td class="whitespace-nowrap px-6 py-4 font-medium" />
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
