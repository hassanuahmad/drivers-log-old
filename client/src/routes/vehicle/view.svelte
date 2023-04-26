<script>
	import axios from 'axios';
	import { onMount } from 'svelte';

	let vehicleMaintenances = [];
	let gasTotal = 0;
	let maintenanceTotal = 0;
	let showModal = false;
	let deleteIndex = null;

	const getVehicleMaintenance = async () => {
		const response = await axios.get('http://localhost:3000/vehicleMaintenance');
		vehicleMaintenances = response.data;

		// Calculate gas and maintenance totals
		for (let maintenance of vehicleMaintenances) {
			gasTotal += maintenance.gas;
			maintenanceTotal += maintenance.maintenance;
		}
	};

	// update total after a row is deleted
	const updateTotals = () => {
		gasTotal = 0;
		maintenanceTotal = 0;

		for (let maintenance of vehicleMaintenances) {
			gasTotal += maintenance.gas;
			maintenanceTotal += maintenance.maintenance;
		}
	};

	const deleteRow = async (index) => {
		try {
			const response = await axios.delete(`http://localhost:3000/vehicleMaintenance/${index}`);

			if (response.status === 200 || response.status === 204) {
				vehicleMaintenances = vehicleMaintenances.filter((val) => val.id !== index);
				updateTotals();
			} else {
				console.error('Error deleting row:', response);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const openModal = (index) => {
		deleteIndex = index;
		showModal = true;
	};

	const closeModal = () => {
		showModal = false;
	};

	const confirmDeletion = () => {
		deleteRow(deleteIndex);
		closeModal();
	};

	onMount(() => {
		getVehicleMaintenance().then(updateTotals);
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
							<th scope="col" class="px-6 py-4" />
						</tr>
					</thead>
					<tbody>
						{#each vehicleMaintenances as vehicleMaintenance, index}
							<tr
								class="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-300"
							>
								<td class="whitespace-nowrap px-6 py-4 font-medium">{index + 1}</td>
								<td class="whitespace-nowrap px-6 py-4">{vehicleMaintenance.date}</td>
								<td class="whitespace-nowrap px-6 py-4">{vehicleMaintenance.odometer}</td>
								<td class="whitespace-nowrap px-6 py-4">{vehicleMaintenance.fueling}</td>
								<td class="whitespace-nowrap px-6 py-4">${vehicleMaintenance.gas}</td>
								<td class="whitespace-nowrap px-6 py-4">${vehicleMaintenance.maintenance}</td>
								<td class="whitespace-nowrap px-6 py-4">{vehicleMaintenance.remarks}</td>
								<td class="whitespace-nowrap px-6 py-4"
									><button on:click={() => openModal(vehicleMaintenance.id)}>X</button></td
								>
							</tr>
						{/each}

						{#if showModal}
							<div
								class="relative z-10"
								aria-labelledby="modal-title"
								role="dialog"
								aria-modal="true"
							>
								<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

								<div class="fixed inset-0 z-10 overflow-y-auto">
									<div
										class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
									>
										<div
											class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
										>
											<div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
												<div class="sm:flex sm:items-start">
													<div
														class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
													>
														<svg
															class="h-6 w-6 text-red-600"
															fill="none"
															viewBox="0 0 24 24"
															stroke-width="1.5"
															stroke="currentColor"
															aria-hidden="true"
														>
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
															/>
														</svg>
													</div>
													<div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
														<h3
															class="text-base font-semibold leading-6 text-gray-900"
															id="modal-title"
														>
															Are you sure you want to delete?
														</h3>
													</div>
												</div>
											</div>
											<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
												<button
													type="button"
													class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
													on:click={confirmDeletion}>Yes, delete</button
												>
												<button
													type="button"
													class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
													on:click={closeModal}>Cancel</button
												>
											</div>
										</div>
									</div>
								</div>
							</div>
						{/if}

						<tr>
							<td class="whitespace-nowrap px-6 py-4 font-medium" />
							<td class="whitespace-nowrap px-6 py-4 font-medium" />
							<td class="whitespace-nowrap px-6 py-4 font-medium" />
							<td class="whitespace-nowrap px-6 py-4 font-medium" />
							<td class="whitespace-nowrap px-6 py-4 font-medium text-indigo-600"
								>Total: ${gasTotal}</td
							>
							<td class="whitespace-nowrap px-6 py-4 font-medium text-indigo-600"
								>Total: ${maintenanceTotal}</td
							>
							<td class="whitespace-nowrap px-6 py-4 font-medium" />
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
