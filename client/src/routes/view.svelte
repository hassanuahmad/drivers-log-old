<script>
	import axios from 'axios';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';

	let lessons = [];
	const lessonsStore = writable([]);

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

	const getLessons = async (selectedYear, selectedMonth) => {
		try {
			const response = await axios.get(`http://localhost:3000/${selectedYear}/${selectedMonth}`);
			lessons = response.data || [];

			for (let lesson of lessons) {
				const studentResponse = await axios.get(
					`http://localhost:3000/student/${lesson.studentId}`
				);
				lesson.student = studentResponse.data;
			}

			// Sort lessons by date
			lessons.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
			// lessons.sort((a, b) => new Date(b.date) - new Date(a.date));

			lessonsStore.set(lessons);
		} catch (error) {
			console.error(error);
		}
	};

	// get the total duration of all lessons
	const getTotalDuration = (lessons) => {
		let totalMinutes = 0;

		for (let lesson of lessons) {
			const [hours, minutes] = lesson.duration.split(' ');

			totalMinutes += Number(hours.replace('h', '')) * 60 + Number(minutes.replace('m', ''));
		}

		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;

		return `${hours}h ${minutes}m`;
	};

	// $: getLessons(selectedYear, selectedMonth);

	// FIXME: The website crashes when the user selects a year/month that has no lessons

	// subscribe to the lessonsStore and call getLessons when the store is updated
	lessonsStore.subscribe(() => {
		getLessons(selectedYear, selectedMonth);
	});

	// event dispatcher to dispatch 'LessonAdded' event
	const dispatchLessonAdded = () => {
		const event = new CustomEvent('lessonAdded');
		dispatchEvent(event);
	};

	// call dispatchLessonAdded when component is mounted
	onMount(() => {
		dispatchLessonAdded();
	});

	const paymentTypes = ['Cash', 'Interac'];

	// Gets the totals by Payment Type
	$: paymentTypeTotals = paymentTypes.reduce((acc, paymentType) => {
		const total = lessons.reduce((sum, lesson) => {
			if (lesson.paymentType === paymentType) {
				return sum + parseFloat(lesson.paymentAmount);
			}
			return sum;
		}, 0);
		return { ...acc, [paymentType]: total };
	}, {});
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
							<th scope="col" class="px-6 py-4">Remarks</th>
						</tr>
					</thead>
					<tbody>
						{#each $lessonsStore.reverse() as lesson}
							<tr
								class="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-300"
							>
								<td class="whitespace-nowrap px-6 py-4 font-medium">{lesson.id}</td>
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
								<td class="whitespace-nowrap px-6 py-4 font-medium">{lesson.remarks}</td>
							</tr>
						{/each}
						<!-- To add the total values at the end of the table -->
						<tr
							class="transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-300"
						>
							<td class="whitespace-nowrap px-6 py-4 font-medium" />
							<td class="whitespace-nowrap px-6 py-4 font-medium" />
							<td class="whitespace-nowrap px-6 py-4 font-medium" />
							<td class="whitespace-nowrap px-6 py-4 font-medium" />
							<td class="whitespace-nowrap px-6 py-4 font-medium text-indigo-600"
								>{getTotalDuration($lessonsStore)}</td
							>
							<td class="whitespace-nowrap px-6 py-4 font-medium text-indigo-600"
								>Total: ${paymentTypeTotals['Cash']}</td
							>
							<td class="whitespace-nowrap px-6 py-4 font-medium text-indigo-600"
								>Total: ${paymentTypeTotals['Interac']}</td
							>
							<td class="whitespace-nowrap px-6 py-4 font-medium" />
							<td class="whitespace-nowrap px-6 py-4 font-medium" />
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
