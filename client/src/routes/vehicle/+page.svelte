<script>
	import axios from 'axios';
	import { goto } from '$app/navigation';
	import VehicleMaintenanceView from './view.svelte';

	const submitVehicleMaintenance = async () => {
		const form = document.querySelector('form');
		const inputs = document.querySelectorAll('input');
		const selects = document.querySelectorAll('select');
		const data = {};
		inputs.forEach((input) => {
			data[input.name] = input.value;
		});
		selects.forEach((select) => {
			data[select.name] = select.value;
		});
		const response = await axios.post('http://localhost:3000/vehicleMaintenance', data);
		console.log(response);
		form.reset();
		goto('/');
	};
</script>

<form on:submit={submitVehicleMaintenance}>
	<div class="space-y-12">
		<div class="border-b border-gray-900/10 pb-12">
			<h2 class="text-base font-semibold leading-7 text-gray-900 pt-10">
				Vehicle Maintenance Entry
			</h2>

			<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
				<div class="sm:col-span-1">
					<label for="date" class="block text-sm font-medium leading-6 text-gray-900">Date</label>
					<div class="mt-2">
						<input
							type="date"
							name="date"
							id="date"
							autocomplete="off"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
							required
							value={new Date().toISOString().substr(0, 10)}
						/>
					</div>
				</div>

				<div class="sm:col-span-1">
					<label for="odometer" class="block text-sm font-medium leading-6 text-gray-900"
						>Odometer</label
					>
					<div class="mt-2">
						<input
							type="number"
							name="odometer"
							id="odometer"
							autocomplete="odometer"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
							required
						/>
					</div>
				</div>

				<div class="sm:col-span-1">
					<label for="fueling" class="block text-sm font-medium leading-6 text-gray-900"
						>Fueling</label
					>
					<div class="mt-2">
						<input
							type="number"
							name="fueling"
							id="fueling"
							autocomplete="fueling"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
							required
						/>
					</div>
				</div>

				<div class="sm:col-span-1">
					<label for="gas" class="block text-sm font-medium leading-6 text-gray-900">Gas</label>
					<div class="mt-2">
						<input
							type="number"
							name="gas"
							id="gas"
							autocomplete="gas"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
							required
						/>
					</div>
				</div>

				<div class="sm:col-span-1">
					<label for="maintenance" class="block text-sm font-medium leading-6 text-gray-900"
						>Maintenance</label
					>
					<div class="mt-2">
						<input
							type="number"
							name="maintenance"
							id="maintenance"
							autocomplete="maintenance"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
							required
						/>
					</div>
				</div>

				<div class="sm:col-span-1">
					<label for="remarks" class="block text-sm font-medium leading-6 text-gray-900"
						>Remarks</label
					>
					<div class="mt-2">
						<input
							type="text"
							name="remarks"
							id="remarks"
							autocomplete="remarks"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="mt-6 flex items-center justify-end gap-x-6">
		<button
			type="submit"
			class="rounded-md bg-indigo-600 px-8 py-3 text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
			>Save</button
		>
	</div>
</form>

<VehicleMaintenanceView />
