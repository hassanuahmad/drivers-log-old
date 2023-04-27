<script>
	import axios from 'axios';
	import { createEventDispatcher } from 'svelte';

	// props from view.svelte
	export let data;
	export let index;
	export let onCancel;

	let updatedData = { ...data };
	const dispatch = createEventDispatcher();

	const saveChanges = async () => {
		try {
			const response = await axios.put(
				`http://localhost:3000/vehicleMaintenance/${updatedData.id}`,
				updatedData
			);
			if (response.status === 200) {
				dispatch('updated'); // Dispatch the custom event
			}
		} catch (error) {
			console.error('Error updating data:', error);
		}
	};
</script>

<tr
	class="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-300"
>
	<td class="whitespace-nowrap px-6 py-4 font-medium">{index + 1}</td>
	<td class="whitespace-nowrap px-6 py-4 font-medium"
		><div class="sm:col-span-1">
			<div class="mt-2">
				<input
					type="date"
					name="date"
					id="date"
					autocomplete="off"
					class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					required
					bind:value={updatedData.date}
				/>
			</div>
		</div>
	</td>
	<td class="whitespace-nowrap px-6 py-4 font-medium">
		<div class="sm:col-span-1">
			<div class="mt-2">
				<input
					type="number"
					name="odometer"
					id="odometer"
					autocomplete="odometer"
					class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					required
					bind:value={updatedData.odometer}
				/>
			</div>
		</div>
	</td>
	<td class="whitespace-nowrap px-6 py-4 font-medium">
		<div class="sm:col-span-1">
			<div class="mt-2">
				<input
					type="number"
					name="fueling"
					id="fueling"
					autocomplete="fueling"
					class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					required
					bind:value={updatedData.fueling}
				/>
			</div>
		</div>
	</td>
	<td class="whitespace-nowrap px-6 py-4 font-medium">
		<div class="sm:col-span-1">
			<div class="mt-2">
				<input
					type="number"
					name="gas"
					id="gas"
					autocomplete="gas"
					class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					required
					bind:value={updatedData.gas}
				/>
			</div>
		</div>
	</td>
	<td class="whitespace-nowrap px-6 py-4 font-medium">
		<div class="sm:col-span-1">
			<div class="mt-2">
				<input
					type="number"
					name="maintenance"
					id="maintenance"
					autocomplete="maintenance"
					class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					required
					bind:value={updatedData.maintenance}
				/>
			</div>
		</div>
	</td>
	<td class="whitespace-nowrap px-6 py-4 font-medium">
		<div class="sm:col-span-1">
			<div class="mt-2">
				<input
					type="text"
					name="remarks"
					id="remarks"
					autocomplete="remarks"
					class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					bind:value={updatedData.remarks}
				/>
			</div>
		</div>
	</td>
	<td class="whitespace-nowrap px-6 py-4 font-medium"
		><button
			on:click={() => {
				saveChanges();
				onCancel();
			}}><i class="fa-solid fa-check" style="color: #5046e5;" /></button
		></td
	>
	<td class="whitespace-nowrap px-6 py-4 font-medium"
		><button on:click={() => onCancel()}
			><i class="fa-solid fa-xmark" style="color: #5046e5;" /></button
		></td
	>
</tr>
