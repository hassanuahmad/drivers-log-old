<script>
	import axios from 'axios';
	import View from './view.svelte';
	import { onMount } from 'svelte';

	let students = [];
	let showSuccessMessage = false;

	onMount(async () => {
		const response = await axios.get('http://localhost:3000/student');
		students = response.data;
	});

	const submit = async () => {
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

		try {
			const response = await axios.post('http://localhost:3000/', data);
			console.log(response);
			form.reset();
			showSuccessMessage = true;
			setTimeout(() => {
				showSuccessMessage = false;
			}, 3000);
		} catch (error) {
			console.error(error);
		}
	};
</script>

<!-- Duration Entry -->

<form on:submit={submit}>
	<div class="space-y-12">
		<div class="border-b border-gray-900/10 pb-12">
			<h2 class="text-base font-semibold leading-7 text-gray-900 pt-10">Lesson Entry</h2>

			<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
				<div class="sm:col-span-1">
					<label for="selectStudent" class="block text-sm font-medium leading-6 text-gray-900"
						>Select Student</label
					>
					<div class="mt-2">
						<select
							id="selectStudent"
							name="selectStudent"
							autocomplete="selectStudent"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
							required
						>
							<option value="" />
							{#each students.reverse() as student}
								<option value={student.id}>{student.firstName} {student.lastName}</option>
							{/each}
						</select>
					</div>
				</div>

				<div class="sm:col-span-1">
					<label for="roadTest" class="block text-sm font-medium leading-6 text-gray-900"
						>Road Test</label
					>
					<div class="mt-2">
						<select
							id="roadTest"
							name="roadTest"
							autocomplete="roadTest"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
							required
						>
							<option>No</option>
							<option>Yes</option>
						</select>
					</div>
				</div>

				<div class="sm:col-span-1 sm:col-start-1">
					<label for="startTime" class="block text-sm font-medium leading-6 text-gray-900"
						>Start Time</label
					>
					<div class="mt-2">
						<input
							type="time"
							name="startTime"
							id="startTime"
							autocomplete="off"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
							required
						/>
					</div>
				</div>

				<div class="sm:col-span-1">
					<label for="endTime" class="block text-sm font-medium leading-6 text-gray-900"
						>End Time</label
					>
					<div class="mt-2">
						<input
							type="time"
							name="endTime"
							id="endTime"
							autocomplete="off"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
							required
						/>
					</div>
				</div>

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
					<label for="paymentType" class="block text-sm font-medium leading-6 text-gray-900"
						>Payment Type</label
					>
					<div class="mt-2">
						<select
							id="paymentType"
							name="paymentType"
							autocomplete="paymentType"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
							required
						>
							<option>Cash</option>
							<option>Interac</option>
						</select>
					</div>
				</div>

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
						/>
					</div>
				</div>

				<div class="sm:col-span-1">
					<label for="bde" class="block text-sm font-medium leading-6 text-gray-900"
						>BDE Student</label
					>
					<div class="mt-2">
						<select
							id="bde"
							name="bde"
							autocomplete="bde"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
							required
						>
							<option>No</option>
							<option>Yes</option>
						</select>
					</div>
				</div>

				<div class="col-span-full">
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
		<!-- TODO: make this notification better looking tho! -->
		<div class={showSuccessMessage ? 'visible' : 'hidden'}>
			<div
				class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
				role="alert"
			>
				<strong class="font-bold">Lesson successfully added!</strong>
			</div>
		</div>

		<button
			type="submit"
			class="rounded-md bg-indigo-600 px-8 py-3 text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
			>Save</button
		>
	</div>
</form>

<View />
