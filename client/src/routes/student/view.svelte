<script>
	import axios from 'axios';
	import { onMount } from 'svelte';

	let students = [];

	const getStudents = async () => {
		const response = await axios.get('http://localhost:3000/student');
		students = response.data;
	};

	onMount(() => {
		getStudents();
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
							<th scope="col" class="px-6 py-4">First Name</th>
							<th scope="col" class="px-6 py-4">Last Name</th>
							<th scope="col" class="px-6 py-4">Phone Number</th>
							<th scope="col" class="px-6 py-4">Address</th>
							<th scope="col" class="px-6 py-4">Email</th>
							<th scope="col" class="px-6 py-4">Class</th>
							<th scope="col" class="px-6 py-4">Remarks</th>
						</tr>
					</thead>
					<tbody>
						{#each students as student}
							<tr
								class="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-300"
							>
								<td class="whitespace-nowrap px-6 py-4 font-medium">{student.id}</td>
								<td class="whitespace-nowrap px-6 py-4">{student.firstName}</td>
								<td class="whitespace-nowrap px-6 py-4">{student.lastName}</td>
								<td class="whitespace-nowrap px-6 py-4">{student.phoneNumber}</td>
								<td class="whitespace-nowrap px-6 py-4">{student.streetAddress}</td>
								<td class="whitespace-nowrap px-6 py-4">{student.email}</td>
								<td class="whitespace-nowrap px-6 py-4">{student.drivingClass}</td>
								<td class="whitespace-nowrap px-6 py-4">{student.remarks}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
