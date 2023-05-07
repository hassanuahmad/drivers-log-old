<script>
	import {
		getYearlyData,
		getTotalDuration,
		getPassedRoadTests,
		getTotalPaymentAmount,
		getTotalGasAmount,
		getTotalMaintenanceAmount
	} from './utils';

	let selectedYear = new Date().getFullYear();
	let years = [selectedYear, selectedYear + 1, selectedYear + 2, selectedYear + 3];

	let lessons = [];
	let uniqueStudentCount;
	let maintenances = [];

	const fetchYearlyData = async () => {
		const [yearlyLessons, yearlyUniqueStudentCount, yearlyMaintenances] = await getYearlyData(
			selectedYear
		);

		lessons = yearlyLessons;
		uniqueStudentCount = yearlyUniqueStudentCount;
		maintenances = yearlyMaintenances;
	};

	$: if (selectedYear) {
		fetchYearlyData();
	}
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
				<dt class="text-base leading-7 text-gray-600">Students</dt>
				<dd class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
					{uniqueStudentCount}
				</dd>
			</div>
			<div class="mx-auto flex max-w-xs flex-col gap-y-4">
				<dt class="text-base leading-7 text-gray-600">Total Amount</dt>
				<dd class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
					${getTotalPaymentAmount(lessons)}
				</dd>
			</div>
			<div class="mx-auto flex max-w-xs flex-col gap-y-4">
				<dt class="text-base leading-7 text-gray-600">Payed for Gas</dt>
				<dd class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
					${getTotalGasAmount(maintenances)}
				</dd>
			</div>
			<div class="mx-auto flex max-w-xs flex-col gap-y-4">
				<dt class="text-base leading-7 text-gray-600">Payed for Maintenance</dt>
				<dd class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
					${getTotalMaintenanceAmount(maintenances)}
				</dd>
			</div>
			<div class="mx-auto flex max-w-xs flex-col gap-y-4">
				<dt class="text-base leading-7 text-gray-600">Students Passed the Road Test</dt>
				<dd class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
					{getPassedRoadTests(lessons)}
				</dd>
			</div>
		</dl>
	</div>
</div>
