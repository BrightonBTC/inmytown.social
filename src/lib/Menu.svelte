<script lang="ts">
	import "bootstrap-icons/font/bootstrap-icons.css";
	import Login from "./Login.svelte";
    import Relays from "./Relays.svelte";
    import { goto } from "$app/navigation";

	import { page } from '$app/stores';  
    import Logo from "./Logo.svelte";
    import { loggedInUser } from "./stores/user";
    import Loading from "./Loading.svelte";
	import ndk from "$lib/stores/ndk";
    import LinkedPfpIcon from "./user/LinkedPFPIcon.svelte";
    import { notifications } from "./stores/persistent";

	let currentPage:string;
	$: currentPage = $page.url.pathname.split('/')[1] || 'home'

</script>

<nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow p-2">
	<div class="container-fluid">
		<a class="navbar-brand" href="/">
			<Logo height={40} />
		</a>
		<button
			class="navbar-toggler"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#navbarSupportedContent"
			aria-controls="navbarSupportedContent"
			aria-expanded="false"
			aria-label="Toggle navigation"
		>
			<span class="navbar-toggler-icon" />
		</button>
		<div class="collapse navbar-collapse  justify-content-between" id="navbarSupportedContent">
			<ul class="navbar-nav page-{currentPage}">
				<li class="nav-item">
					<a class="nav-link nav-home text-white px-2 mx-1" href="/"
						><i class="bi bi-house text-success"></i> Home</a
					>
				</li>
				<li class="nav-item">
					<a class="nav-link nav-discover text-white px-2 mx-1" href="/discover"
						><i class="bi bi-eye text-success"></i> Discover</a
					>
				</li>
				<li class="nav-item">
					<a
						class="nav-link nav-about text-white px-2 mx-1"
						href="/about"
						><i class="bi bi-info-circle text-success"  /> About</a
					>
				</li>
			</ul>
			<ul class="navbar-nav">
				<li class="nav-item">
					<a href="#top" class="nav-link rounded px-2" data-bs-toggle="modal" data-bs-target="#relayModal">
						<i class="bi bi-arrow-down-up text-light"  />
					</a>
				</li>
				<li class="nav-item u-icon">
					{#if $ndk && $loggedInUser}
						{#await $loggedInUser.fetchProfile()}
							<Loading />
						{:then}
							{#if $notifications.length > 0}
							<span class="notif rounded-circle text-light badge px-0 shadow-sm">
								{$notifications.length < 100 ? $notifications.length : '99+'}
							</span>
							{/if}
							<a
								class="d-flex nav-link p-0"
								href="/user/{$loggedInUser.npub}"
							>
							<LinkedPfpIcon cls="sm nav-uim align-self-center me-2 ms-2" npub={$loggedInUser.npub} /> 
								<!-- <img
									src={imgUrlOrDefault($loggedInUser.profile?.image, 'user')}
									class="rounded-circle nav-uim align-self-center me-2 ms-2"
									alt="{$loggedInUser.profile?.name} pfp"
								/> -->
							</a>
						{:catch error}
							<span style="color: red">{error.message}</span>
						{/await}
					{:else}
						<Login />
					{/if}
				</li>
			</ul>
		</div>
		
	</div>
</nav>


<div class="modal" id="relayModal">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">Current Relays</h4>
				<button
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
				/>
			</div>
			<div class="modal-body">
				<Relays />
			</div>
			<div class="modal-footer">
				<button class="btn btn-primary" data-bs-dismiss="modal" on:click={() => goto('/relays')}>Edit Relays</button>
			</div>
		</div>
	</div>
</div>

<!-- The Modal -->
<div class="modal" id="loginModal">
	<div class="modal-dialog">
		<div class="modal-content">
			<!-- Modal Header -->
			<div class="modal-header">
				<h4 class="modal-title">Login info</h4>
				<button
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
				/>
			</div>

			<!-- Modal body -->
			<div class="modal-body">
				<p>
					Access to features such as joining or creating communities
					on this site requires you to login to the NOSTR netowork
					using a browser extension such as:
				</p>
				<ul>
					<li><a href="https://getalby.com/">Alby</a></li>
					<li>
						<a
							href="https://chrome.google.com/webstore/detail/nos2x/kpgefcfmnafjgpblomihpgmejjdanjjp"
							>nos2x</a
						>
					</li>
				</ul>
				<p>
					Unlike a traditional web platform this site does not store
					any data on its own servers but instead interacts with
					relays on the NOSTR network
				</p>
				<p>NOSTR is a protocol that:</p>
				<ul>
					<li>Allows you to own your own online identity.</li>
					<li>
						Allows you to cryptographically sign all your
						interactions on the network to prove you are the author.
					</li>
					<li>
						Enable an open source, censorship resistant, freedom
						oriented network of participants to interact with each
						other freely online.
					</li>
					<li>
						Carry your identity and social graph across various
						different apps that leverage the protocol.
					</li>
				</ul>
			</div>

			<!-- Modal footer -->
			<div class="modal-footer">
				<button
					type="button"
					class="btn btn-danger"
					data-bs-dismiss="modal">Close</button
				>
			</div>
		</div>
	</div>
</div>

<style>
	i {
		font-size: 1em;
	}
	.nav-uim {
		width: 40px;
		height: 40px;
		object-fit: cover;
	}
	.navbar{
		border-bottom: 2px solid #323d48 !important;
	}
	.navbar:hover{
		opacity: 1;
	}
	.u-icon{
		position: relative;
	}
	.notif{
		background: green;
		position: absolute;
		z-index: 100;
		right: 0;
		max-width: 2em;
		width: 2em;
		text-align: center;
		overflow: hidden;
		font-size: 60%;
	}
</style>
