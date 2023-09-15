<script lang="ts">
	import "bootstrap-icons/font/bootstrap-icons.css";
	import { derivedProfile, userNpub } from "$lib/stores";
	import Login from "./Login.svelte";
	import { imgUrlOrDefault } from "./helpers";
    import Relays from "./Relays.svelte";
    import { goto } from "$app/navigation";

	import { page } from '$app/stores';  

	let currentPage:string;
	$: currentPage = $page.url.pathname.split('/')[1] || 'home'
</script>

<nav class="navbar navbar-expand-lg navbar-dark fixed-top shadow">
	<div class="container-fluid">
		<a class="navbar-brand" href="/">
			<img src="/img/meetup-logo.png" alt="home" />
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
					<a class="nav-link nav-home text-white" href="/"
						><i class="bi bi-house text-success"></i> Home</a
					>
				</li>
				<li class="nav-item">
					<a class="nav-link nav-discover text-white" href="/discover"
						><i class="bi bi-eye text-success"></i> Discover</a
					>
				</li>
				<li class="nav-item">
					<a
						class="nav-link nav-about text-white"
						href="/about"
						><i class="bi bi-info-circle text-success"  /> About</a
					>
				</li>
			</ul>
			<ul class="navbar-nav">
				<li class="nav-item">
					{#if $userNpub}
						{#if $derivedProfile}
						<a
							class="d-flex nav-link "
							href="/user/{$userNpub}"
						>
							<img
								src={imgUrlOrDefault($derivedProfile.image)}
								class="rounded-circle nav-uim align-self-center me-2 ms-2"
								alt="{$derivedProfile.name} pfp"
							/>
						</a>
						{/if}
					{:else}
						<Login />
					{/if}
				</li>
				<li class="nav-item">
					<a href="#top" class="nav-link bg-dark rounded" data-bs-toggle="modal" data-bs-target="#relayModal">
						<i class="bi bi-arrow-down-up text-light"  />
					</a>
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
				<button
					type="button"
					class="btn btn-danger"
					data-bs-dismiss="modal">Close</button
				>
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
		width: 24px;
		height: 24px;
		object-fit: cover;
	}
	.navbar{
		background-color: #323d48;
	}
	.navbar:hover{
		opacity: 1;
	}
</style>
