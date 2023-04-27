<script>
	import axios from 'axios';
	import { createEventDispatcher } from 'svelte';

	// props from view.svelte
	export let data;
	export let index;
	export let onCancel;

	console.log(data);

	let updatedData = { ...data };
	const dispatch = createEventDispatcher();

	const saveChanges = async () => {
		try {
			const response = await axios.put(`http://localhost:3000/${updatedData.id}`, updatedData);
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
		>{data.student.firstName} {data.student.lastName}</td
	>
	<td class="whitespace-nowrap px-6 py-4 font-medium">
		<div class="sm:col-span-1">
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
		<div class="sm:col-span-1 sm:col-start-1">
			<div class="mt-2">
				<input
					type="time"
					name="startTime"
					id="startTime"
					autocomplete="off"
					class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					required
					bind:value={updatedData.startTime}
				/>
			</div>
		</div>
	</td>
	<td class="whitespace-nowrap px-6 py-4 font-medium">
		<div class="sm:col-span-1">
			<label for="endTime" class="block text-sm font-medium leading-6 text-gray-900">End Time</label
			>
			<div class="mt-2">
				<input
					type="time"
					name="endTime"
					id="endTime"
					autocomplete="off"
					class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					required
					bind:value={updatedData.endTime}
				/>
			</div>
		</div>
	</td>
	<td class="whitespace-nowrap px-6 py-4 font-medium">
		<div class="sm:col-span-1">
			<div class="mt-2">
				<select
					id="paymentType"
					name="paymentType"
					autocomplete="paymentType"
					class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
					required
					bind:value={updatedData.paymentType}
				>
					<option>Cash</option>
					<option>Interac</option>
				</select>
			</div>
		</div>
	</td>
	<td class="whitespace-nowrap px-6 py-4 font-medium">
		<div class="sm:col-span-1">
			<label for="paymentAmount" class="block text-sm font-medium leading-6 text-gray-900"
				>Payment Amount</label
			>
			<div class="mt-2">
				<input
					type="number"
					name="paymentAmount"
					id="paymentAmount"
					autocomplete="paymentAmount"
					class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					required
					bind:value={updatedData.paymentAmount}
				/>
			</div>
		</div>
	</td>
	<td class="whitespace-nowrap px-6 py-4 font-medium">
		<div class="sm:col-span-1">
			<div class="mt-2">
				<select
					id="roadTest"
					name="roadTest"
					autocomplete="roadTest"
					class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
					required
					bind:value={updatedData.roadTest}
				>
					<option>No</option>
					<option>Pass</option>
					<option>Fail</option>
				</select>
			</div>
		</div>
	</td>
	<td class="whitespace-nowrap px-6 py-4 font-medium">
		<div class="sm:col-span-1">
			<div class="mt-2">
				<select
					id="bde"
					name="bde"
					autocomplete="bde"
					class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
					required
					bind:value={updatedData.bde}
				>
					<option>No</option>
					<option>Yes</option>
				</select>
			</div>
		</div>
	</td>
	<td class="whitespace-nowrap px-6 py-4 font-medium">
		<div class="col-span-full">
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
