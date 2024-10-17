<script lang="ts">
    import Logo from '../../widgets/Logo.svelte';
    import Navbar from '../../widgets/Navbar.svelte';
    import GithubLink from '../../widgets/GithubLink.svelte';

    let {form} = $props();
</script>

<svelte:head>
    <title>Exeflow - Login</title>
</svelte:head>

<Navbar>
    {#snippet right()}
        <GithubLink />
    {/snippet}
</Navbar>

<main>
    <form method="post">
        <Logo flow="horizontal" imgSize="4rem" textSize="3rem" />
        <input name="email" type="email" value={form?.email ?? ''} placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
        <a href="/auth/register">Register instead</a>
        {#if form?.failed}<p class="error">{form.message}</p>{/if}
        {#if form?.invalid}<p class="error">Email and password are required</p>{/if}
    </form>
</main>

<style>
    main {
        display: flex;
        flex-grow: 1;
        align-items: center;
        justify-content: center;
    }

    form {
        gap: 0.5rem;
        width: 16rem;
        display: flex;
        flex-direction: column;
    }

    input[type='email'],
    input[type='password'] {
        width: 100%;
    }
</style>
