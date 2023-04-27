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
				`http://localhost:3000/student/${updatedData.id}`,
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
	<td class="whitespace-nowrap px-6 py-4 font-medium">
		<div class="sm:col-span-1">
			<div class="mt-2">
				<input
					type="text"
					name="firstName"
					id="firstName"
					autocomplete="firstName"
					class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					required
					bind:value={updatedData.firstName}
				/>
			</div>
		</div>
	</td>
	<td class="whitespace-nowrap px-6 py-4 font-medium">
		<div class="sm:col-span-1">
			<div class="mt-2">
				<input
					type="text"
					name="lastName"
					id="lastName"
					autocomplete="lastName"
					class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					required
					bind:value={updatedData.lastName}
				/>
			</div>
		</div>
	</td>
	<td class="whitespace-nowrap px-6 py-4 font-medium">
		<div class="sm:col-span-1">
			<div class="mt-2">
				<input
					type="tel"
					name="phoneNumber"
					id="phoneNumber"
					autocomplete="tel"
					class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					required
					bind:value={updatedData.phoneNumber}
				/>
			</div>
		</div>
	</td>
	<td class="whitespace-nowrap px-6 py-4 font-medium">
		<div class="sm:col-span-1">
			<div class="mt-2">
				<input
					type="text"
					name="streetAddress"
					id="streetAddress"
					autocomplete="streetAddress"
					class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					required
					bind:value={updatedData.streetAddress}
				/>
			</div>
		</div>
	</td>
	<td class="whitespace-nowrap px-6 py-4 font-medium">
		<div class="sm:col-span-1">
			<div class="mt-2">
				<input
					id="email"
					name="email"
					type="email"
					autocomplete="email"
					class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					bind:value={updatedData.email}
				/>
			</div>
		</div>
	</td>
	<td class="whitespace-nowrap px-6 py-4 font-medium">
		<div class="sm:col-span-1">
			<label for="drivingClass" class="block text-sm font-medium leading-6 text-gray-900"
				>Class</label
			>
			<div class="mt-2">
				<select
					id="drivingClass"
					name="drivingClass"
					autocomplete="drivingClass"
					class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
					required
					bind:value={updatedData.drivingClass}
				>
					<option>G2</option>
					<option>G</option>
				</select>
			</div>
		</div>
	</td>
	<td class="whitespace-nowrap px-6 py-4 font-medium">
		<div class="col-span-full">
			<label for="remarks" class="block text-sm font-medium leading-6 text-gray-900">Remarks</label>
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
