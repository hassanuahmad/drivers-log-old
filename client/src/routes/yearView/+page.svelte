<script>
	import axios from 'axios';

	let selectedYear = new Date().getFullYear();
	let years = [selectedYear, selectedYear + 1, selectedYear + 2, selectedYear + 3];

	let lessons = [];
	let uniqueStudentCount;
	let maintenances = [];

	const getYearlyData = async (selectedYear) => {
		try {
			const response = await axios.get(`http://localhost:3000/yearView/${selectedYear}`);

			lessons = response.data.lessons;
			uniqueStudentCount = response.data.uniqueStudentCount;
			maintenances = response.data.maintenance;
		} catch (err) {
			console.error('Error fetching data:', err);
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

	// get the total road test "Pass" students
	const getPassedRoadTests = (lessons) => {
		return lessons.filter((lesson) => lesson.roadTest === 'Pass').length;
	};

	// get the total payment amount
	const getTotalPaymentAmount = (lessons) => {
		const total = lessons.reduce((accumulator, lesson) => {
			return accumulator + parseFloat(lesson.paymentAmount);
		}, 0);

		return total;
	};

	// get the total payment amount
	const getTotalGasAmount = (maintenance) => {
		const total = maintenance.reduce((accumulator, maintenanceItem) => {
			return accumulator + parseInt(maintenanceItem.gas, 10);
		}, 0);

		return total;
	};

	$: getYearlyData(selectedYear);
</script>

<div class="flex items-center">
	<select id="year" name="year" class="border rounded-md py-1 px-2 w-24" bind:value={selectedYear}>
		{#each years as year}
			<option value={year}>{year}</option>
		{/each}
	</select>
</div>

<div class="mx-auto max-w-2xl text-center">
	<h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
		{selectedYear} Annual Summary
	</h2>
</div>

<div class="bg-white py-24 sm:py-32">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<dl class="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
			<div class="mx-auto flex max-w-xs flex-col gap-y-4">
				<dt class="text-base leading-7 text-gray-600">Amount of Lessons</dt>
				<dd class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
					{lessons.length}
				</dd>
			</div>
			<div class="mx-auto flex max-w-xs flex-col gap-y-4">
				<dt class="text-base leading-7 text-gray-600">Total Lesson Hours</dt>
				<dd class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
					{getTotalDuration(lessons)}
				</dd>
			</div>
			<div class="mx-auto flex max-w-xs flex-col gap-y-4">
				<dt class="text-base leading-7 text-gray-600">Total Amount</dt>
				<dd class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
					${getTotalPaymentAmount(lessons)}
				</dd>
			</div>
			<div class="mx-auto flex max-w-xs flex-col gap-y-4">
				<dt class="text-base leading-7 text-gray-600">Students Passed the Road Test</dt>
				<dd class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
					{getPassedRoadTests(lessons)}
				</dd>
			</div>
			<div class="mx-auto flex max-w-xs flex-col gap-y-4">
				<dt class="text-base leading-7 text-gray-600">Students</dt>
				<dd class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
					{uniqueStudentCount}
				</dd>
			</div>

			<div class="mx-auto flex max-w-xs flex-col gap-y-4">
				<dt class="text-base leading-7 text-gray-600">Payed for Gas</dt>
				<dd class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
					${getTotalGasAmount(maintenances)}
				</dd>
			</div>
		</dl>
	</div>
</div>
