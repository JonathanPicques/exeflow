<script lang="ts">
    import Logo from '../../../widgets/Logo.svelte';
    import Navbar from '../../../widgets/Navbar.svelte';
    import GithubLink from '../../../widgets/GithubLink.svelte';

    let {form} = $props();
</script>

<svelte:head>
    <title>Exeflow - Forgot password</title>
</svelte:head>

<Navbar>
    {#snippet right()}
        <GithubLink />
    {/snippet}
</Navbar>

<main>
    {#if !form?.sent}
        <form method="post">
            <Logo flow="horizontal" imgSize="4rem" textSize="3rem" />
            <label for="email">Email</label>
            <input id="email" name="email" type="email" value={form?.email ?? ''} placeholder="Enter your email address…" autocomplete="email" required />
            <button type="submit">Send</button>
            <a href="/auth/login">Login instead</a>
            {#if form?.failed}<p class="error">{form.message}</p>{/if}
        </form>
    {:else}
        If your account exists, an email with a reset link is on its way.
    {/if}
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
        width: 18rem;
        display: flex;
        flex-direction: column;
    }

    input[type='email'] {
        width: 100%;
    }

    button[type='submit'] {
        margin-top: 0.5rem;
    }
</style>
