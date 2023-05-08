<script>
	import { writable } from 'svelte/store';
	import { getLessons, getTotalDuration, getPaymentTypeTotals } from './utils';
	import { deleteRow } from './utils/deleteUtil';
	import Edit from './edit.svelte';

	let lessons = [];
	const lessonsStore = writable([]);
	let cashAmount = 0;
	let interacAmount = 0;
	let totalDuration = null;

	let showModal = false;
	let deleteIndex = null;
	let editingIndex = -1;

	// Year/Month Dropdown
	let selectedYear = new Date().getFullYear();
	let selectedMonth = ('0' + (new Date().getMonth() + 1)).slice(-2); // default to current month

	let years = [selectedYear, selectedYear + 1, selectedYear + 2, selectedYear + 3]; // years to show in dropdown
	let months = [
		{ value: '01', name: 'January' },
		{ value: '02', name: 'February' },
		{ value: '03', name: 'March' },
		{ value: '04', name: 'April' },
		{ value: '05', name: 'May' },
		{ value: '06', name: 'June' },
		{ value: '07', name: 'July' },
		{ value: '08', name: 'August' },
		{ value: '09', name: 'September' },
		{ value: '10', name: 'October' },
		{ value: '11', name: 'November' },
		{ value: '12', name: 'December' }
	];

	const fetchLessons = async () => {
		lessons = await getLessons(selectedYear, selectedMonth);
		lessonsStore.set(lessons);
	};

	$: if (selectedMonth && selectedYear) {
		fetchLessons();
	}

	// fetch data for inital load
	$: if ($lessonsStore) {
		fetchPaymentTypeTotals($lessonsStore);
		fetchTotalDuration($lessonsStore);
	}

	const fetchPaymentTypeTotals = async (updatedLessons) => {
		const paymentTypeTotals = await getPaymentTypeTotals(updatedLessons);
		cashAmount = paymentTypeTotals.cashAmount;
		interacAmount = paymentTypeTotals.interacAmount;
	};

	const fetchTotalDuration = async (updatedLessons) => {
		totalDuration = await getTotalDuration(updatedLessons);
	};

	// this function downloads the lessons array as a CSV file
	const downloadCSV = () => {
		const csvData = convertToCSV(lessons);
		const csvBlob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
		const csvUrl = URL.createObjectURL(csvBlob);
		const downloadLink = document.createElement('a');
		downloadLink.href = csvUrl;
		downloadLink.download = `${selectedMonth}-${selectedYear} lessons.csv`;
		downloadLink.click();
		URL.revokeObjectURL(csvUrl);
	};

	const convertToCSV = (data) => {
		const headers = [
			'Name',
			'Date',
			'Payment Type',
			'Payment Amount',
			'Start Time',
			'End Time',
			'Duration',
			'Road Test',
			'BDE',
			'Address',
			'Phone Number',
			'Remarks'
		];
		const csvRows = data.map((lesson) => {
			return [
				lesson.student.firstName + lesson.student.lastName,
				lesson.date,
				lesson.paymentType,
				lesson.paymentAmount,
				lesson.startTime,
				lesson.endTime,
				lesson.duration,
				lesson.roadTest,
				lesson.bde,
				lesson.student.streetAddress,
				lesson.student.phoneNumber,
				lesson.remarks
			].join(',');
		});

		return [headers.join(','), ...csvRows].join('\n');
	};

	const confirmDeletion = async () => {
		const { success } = await deleteRow('http://localhost:3000', deleteIndex);
		if (success) {
			lessons = lessons.filter((val) => val.id !== deleteIndex);
			fetchLessons();
			fetchTotalDuration(lessons);
			fetchPaymentTypeTotals(lessons);
			closeModal();
		}
	};

	const openModal = (index) => {
		deleteIndex = index;
		showModal = true;
	};

	const closeModal = () => {
		showModal = false;
	};

	// Edit Action
	const editRowIndex = (index) => {
		editingIndex = index;
	};

	const cancelEdit = () => {
		editingIndex = -1;
	};

	const handleEditDone = () => {
		fetchLessons();
	};
</script>

<div class="flex flex-col">
	<div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
		<div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
			<div class="flex items-center">
				<select
					id="year"
					name="year"
					class="border rounded-md py-1 px-2 w-24"
					bind:value={selectedYear}
				>
					{#each years as year}
						<option value={year}>{year}</option>
					{/each}
				</select>

				<select
					id="month"
					name="month"
					class="border rounded-md py-1 px-2 ml-2"
					bind:value={selectedMonth}
				>
					{#each months as month}
						<option value={month.value}>{month.name}</option>
					{/each}
				</select>
			</div>
			<div class="mt-6 flex items-center gap-x-6">
				<button
					type="submit"
					class="rounded-md bg-indigo-600 px-8 py-3 text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					on:click={downloadCSV}>Download CSV</button
				>
			</div>
			<div class="overflow-hidden">
				<table class="min-w-full text-left text-sm font-light">
					<thead class="border-b font-medium dark:border-neutral-500">
						<tr>
							<th scope="col" class="px-6 py-4">#</th>
							<th scope="col" class="px-6 py-4">Name</th>
							<th scope="col" class="px-6 py-4">Date</th>
							<th scope="col" class="px-6 py-4">Start Time</th>
							<th scope="col" class="px-6 py-4">Duration</th>
							<th scope="col" class="px-6 py-4">Cash Payment</th>
							<th scope="col" class="px-6 py-4">Interac Payment</th>
							<th scope="col" class="px-6 py-4">Road Test</th>
							<th scope="col" class="px-6 py-4">BDE</th>
							<th scope="col" class="px-6 py-4">Remarks</th>
							<th scope="col" class="px-6 py-4" />
							<th scope="col" class="px-6 py-4" />
						</tr>
					</thead>
					<tbody>
						{#each $lessonsStore as lesson, index}
							{#if editingIndex === lesson.id}
								<Edit
									data={lesson}
									{index}
									onCancel={cancelEdit}
									on:updated={() => {
										handleEditDone();
									}}
								/>
							{:else}
								<tr
									class="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-300"
								>
									<td class="whitespace-nowrap px-6 py-4 font-medium">{index + 1}</td>
									<td class="whitespace-nowrap px-6 py-4 font-medium"
										>{lesson.student.firstName} {lesson.student.lastName}</td
									>
									<td class="whitespace-nowrap px-6 py-4 font-medium">{lesson.date}</td>
									<td class="whitespace-nowrap px-6 py-4 font-medium">{lesson.startTime}</td>
									<td class="whitespace-nowrap px-6 py-4 font-medium">{lesson.duration}</td>
									{#if lesson.paymentType === 'Cash'}
										<td class="whitespace-nowrap px-6 py-4 font-medium">${lesson.paymentAmount}</td>
										<td class="whitespace-nowrap px-6 py-4 font-medium" />
									{:else}
										<td class="whitespace-nowrap px-6 py-4 font-medium" />
										<td class="whitespace-nowrap px-6 py-4 font-medium">${lesson.paymentAmount}</td>
									{/if}
									<td class="whitespace-nowrap px-6 py-4 font-medium">{lesson.roadTest}</td>
									<td class="whitespace-nowrap px-6 py-4 font-medium">{lesson.bde}</td>
									<td class="whitespace-nowrap px-6 py-4 font-medium">{lesson.remarks}</td>
									<td class="whitespace-nowrap px-6 py-4"
										><button on:click={() => editRowIndex(lesson.id)}
											><i class="fa-regular fa-pen-to-square" style="color: #5046e5;" /></button
										></td
									>
									<td class="whitespace-nowrap px-6 py-4"
										><button on:click={() => openModal(lesson.id)}
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

						<!-- To add the total values at the end of the table -->
						<tr
							class="transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-300"
						>
							<td class="whitespace-nowrap px-6 py-4 font-medium" />
							<td class="whitespace-nowrap px-6 py-4 font-medium" />
							<td class="whitespace-nowrap px-6 py-4 font-medium" />
							<td class="whitespace-nowrap px-6 py-4 font-medium" />
							<td class="whitespace-nowrap px-6 py-4 font-medium text-indigo-600"
								>Total: {totalDuration}</td
							>
							<td class="whitespace-nowrap px-6 py-4 font-medium text-indigo-600"
								>Total: ${cashAmount}</td
							>
							<td class="whitespace-nowrap px-6 py-4 font-medium text-indigo-600"
								>Total: ${interacAmount}</td
							>
							<td class="whitespace-nowrap px-6 py-4 font-medium" />
							<td class="whitespace-nowrap px-6 py-4 font-medium" />
							<td class="whitespace-nowrap px-6 py-4 font-medium" />
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
