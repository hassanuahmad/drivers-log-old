<script>
	import axios from 'axios';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let lessons = [];
	const lessonsStore = writable([]);

	const getLessons = async () => {
		const response = await axios.get('http://localhost:3000/');
		lessons = response.data;

		for (let lesson of lessons) {
			const studentResponse = await axios.get(`http://localhost:3000/student/${lesson.studentId}`);
			lesson.student = studentResponse.data;
		}
		lessonsStore.set(lessons);
	};

	onMount(() => {
		getLessons();
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
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
