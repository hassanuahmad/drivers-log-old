<script>
	import { onMount } from 'svelte';
	import axios from 'axios';

	const CLIENT_ID = '592944968932-p2h545v765tak1io9m2bqoug4fvkp2c9.apps.googleusercontent.com';

	// navbar.svelte
	onMount(() => {
		//@ts-ignore
		window.google.accounts.id.initialize({
			client_id: CLIENT_ID,
			callback: async (response) => {
				if (response.credential) {
					const accessToken = response.credential;

					// Send the access token and refresh token to the backend
					await axios.post('http://localhost:3000/auth', {accessToken});
				} else {
					console.error('Error:', response);
				}
			}
		});

		const googleBtn = document.getElementById('google-signin-button');

		//@ts-ignore
		window.google.accounts.id.renderButton(googleBtn, {
			theme: 'outline',
			size: 'large'
		});
	});
</script>

<div class="py-8 drop-shadow-sm">
	<div class="flex justify-between">
		<div>
			<a href="/">Home</a>
			<a href="/student" class="pl-4">Students</a>
			<a href="/vehicle" class="pl-4">Vehicle Maintenance</a>
			<a href="/yearView" class="pl-4">Yearly View</a>
		</div>
		<div><div id="google-signin-button" /></div>
	</div>
</div>
