<script>
	import axios from 'axios';
	import { goto } from '$app/navigation';
	import StudentView from './view.svelte';

	const submitStudent = async () => {
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
		const response = await axios.post('http://localhost:3000/student', data);
		console.log(response);
		form.reset();
		goto('/');
	};
</script>

<form on:submit={submitStudent}>
	<div class="space-y-12">
		<div class="border-b border-gray-900/10 pb-12">
			<h2 class="text-base font-semibold leading-7 text-gray-900 pt-10">Student Entry</h2>

			<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
				<div class="sm:col-span-1">
					<label for="firstName" class="block text-sm font-medium leading-6 text-gray-900"
						>First name</label
					>
					<div class="mt-2">
						<input
							type="text"
							name="firstName"
							id="firstName"
							autocomplete="firstName"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
							required
						/>
					</div>
				</div>

				<div class="sm:col-span-1">
					<label for="lastName" class="block text-sm font-medium leading-6 text-gray-900"
						>Last name</label
					>
					<div class="mt-2">
						<input
							type="text"
							name="lastName"
							id="lastName"
							autocomplete="lastName"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
							required
						/>
					</div>
				</div>

				<div class="sm:col-span-1">
					<label for="phoneNumber" class="block text-sm font-medium leading-6 text-gray-900"
						>Phone Number</label
					>
					<div class="mt-2">
						<input
							type="tel"
							name="phoneNumber"
							id="phoneNumber"
							autocomplete="tel"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
							required
						/>
					</div>
				</div>

				<div class="sm:col-span-1">
					<label for="streetAddress" class="block text-sm font-medium leading-6 text-gray-900"
						>Street address</label
					>
					<div class="mt-2">
						<input
							type="text"
							name="streetAddress"
							id="streetAddress"
							autocomplete="streetAddress"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
							required
						/>
					</div>
				</div>

				<div class="sm:col-span-1">
					<label for="email" class="block text-sm font-medium leading-6 text-gray-900"
						>Email address</label
					>
					<div class="mt-2">
						<input
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

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
						>
							<option>G2</option>
							<option>G</option>
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
		<button
			type="submit"
			class="rounded-md bg-indigo-600 px-8 py-3 text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
			>Save</button
		>
	</div>
</form>

<StudentView />
