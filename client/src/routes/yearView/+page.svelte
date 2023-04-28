<script>
	import axios from 'axios';

	let selectedYear = new Date().getFullYear();
	let years = [selectedYear, selectedYear + 1, selectedYear + 2, selectedYear + 3];

	let yearlyData = [];

	const getYearlyData = async (selectedYear) => {
		const response = await axios.get(`http://localhost:3000/yearView/${selectedYear}`);
		yearlyData = response.data;
	};

	// get the total duration of all lessons
	const getTotalDuration = (yearlyData) => {
		let totalMinutes = 0;

		for (let lesson of yearlyData) {
			const [hours, minutes] = lesson.duration.split(' ');

			totalMinutes += Number(hours.replace('h', '')) * 60 + Number(minutes.replace('m', ''));
		}

		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;

		return `${hours}h ${minutes}m`;
	};

	// get the total road test "Pass" students
	const getPassedRoadTests = (yearlyData) => {
		return yearlyData.filter((lesson) => lesson.roadTest === 'Pass').length;
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

<div class="bg-white py-24 sm:py-32">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<dl class="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
			<div class="mx-auto flex max-w-xs flex-col gap-y-4">
				<dt class="text-base leading-7 text-gray-600">Amount of Classes</dt>
				<dd class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
					{yearlyData.length}
				</dd>
			</div>
			<div class="mx-auto flex max-w-xs flex-col gap-y-4">
				<dt class="text-base leading-7 text-gray-600">Total Class Hours</dt>
				<dd class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
					{getTotalDuration(yearlyData)}
				</dd>
			</div>
			<div class="mx-auto flex max-w-xs flex-col gap-y-4">
				<dt class="text-base leading-7 text-gray-600">Students that Passed the Road Test</dt>
				<dd class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
					{getPassedRoadTests(yearlyData)}
				</dd>
			</div>
		</dl>
	</div>
</div>
