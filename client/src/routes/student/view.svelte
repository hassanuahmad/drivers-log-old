<script>
	import { onMount } from 'svelte';
	import { getStudents } from './utils';
	import { deleteRow } from '../utils/deleteUtil';
	import Edit from './edit.svelte';

	let students = [];

	let showModal = false;
	let deleteIndex = null;
	let errorMessage = null;
	let editingIndex = -1;

	const fetchStudents = async () => {
		const response = await getStudents();
		students = response;
	};

	const showError = (message, duration = 5000) => {
		errorMessage = message;
		setTimeout(() => {
			errorMessage = null;
		}, duration);
	};

	const confirmDeletion = async () => {
		const { success, message } = await deleteRow('http://localhost:3000/student', deleteIndex);

		if (success) {
			students = students.filter((val) => val.id !== deleteIndex);
		} else {
			showError(message, 5000);
		}
		closeModal();
	};

	onMount(() => {
		fetchStudents();
	});

	const openModal = (index) => {
		deleteIndex = index;
		showModal = true;
	};

	const closeModal = () => {
		showModal = false;
	};

	const editRowIndex = (index) => {
		editingIndex = index;
	};

	const cancelEdit = () => {
		editingIndex = -1;
	};
</script>

<!-- Add this div to display the error message -->
{#if errorMessage}
	<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
		{errorMessage}
	</div>
{/if}

<div class="flex flex-col">
	<div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
		<div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
			<div class="overflow-hidden">
				<table class="min-w-full text-left text-sm font-light">
					<thead class="border-b font-medium dark:border-neutral-500">
						<tr>
							<th scope="col" class="px-6 py-4">#</th>
							<th scope="col" class="px-6 py-4">First Name</th>
							<th scope="col" class="px-6 py-4">Last Name</th>
							<th scope="col" class="px-6 py-4">Phone Number</th>
							<th scope="col" class="px-6 py-4">Address</th>
							<th scope="col" class="px-6 py-4">Email</th>
							<th scope="col" class="px-6 py-4">Class</th>
							<th scope="col" class="px-6 py-4">Remarks</th>
							<th scope="col" class="px-6 py-4" />
							<th scope="col" class="px-6 py-4" />
						</tr>
					</thead>
					<tbody>
						{#each students as student, index}
							{#if editingIndex === student.id}
								<Edit
									data={student}
									{index}
									onCancel={cancelEdit}
									on:updated={() => {
										fetchStudents();
									}}
								/>
							{:else}
								<tr
									class="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-300"
								>
									<td class="whitespace-nowrap px-6 py-4 font-medium">{index + 1}</td>
									<td class="whitespace-nowrap px-6 py-4">{student.firstName}</td>
									<td class="whitespace-nowrap px-6 py-4">{student.lastName}</td>
									<td class="whitespace-nowrap px-6 py-4">{student.phoneNumber}</td>
									<td class="whitespace-nowrap px-6 py-4">{student.streetAddress}</td>
									<td class="whitespace-nowrap px-6 py-4">{student.email}</td>
									<td class="whitespace-nowrap px-6 py-4">{student.drivingClass}</td>
									<td class="whitespace-nowrap px-6 py-4">{student.remarks}</td>
									<td class="whitespace-nowrap px-6 py-4"
										><button on:click={() => editRowIndex(student.id)}
											><i class="fa-regular fa-pen-to-square" style="color: #5046e5;" /></button
										></td
									>
									<td class="whitespace-nowrap px-6 py-4"
										><button on:click={() => openModal(student.id)}
											><i class="fa-regular fa-trash-can" style="color: #5046e5;" /></button
										></td
									>
								</tr>
							{/if}
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
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
