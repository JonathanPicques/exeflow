<script lang="ts">
    import Logo from '$lib/core/widgets/Logo.svelte';
    import Navbar from '$lib/core/widgets/Navbar.svelte';
    import GithubLink from '$lib/core/widgets/GithubLink.svelte';

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
        <Logo flow="horizontal" imgSize="4rem" textSize="3rem" transition={true} />
        <label for="email">Email</label>
        <input id="email" name="email" type="email" value={form?.email ?? ''} placeholder="Enter your email address…" autocomplete="email" required />
        <label for="password">Password</label>
        <input id="password" name="password" type="password" placeholder="Enter your password…" autocomplete="current-password" minlength="6" required />
        <button type="submit">Login</button>
        {#if form?.error}
            <p class="error">
                {form.error.message}
            </p>
        {/if}
        <a href="/auth/register">Register instead</a>
        <a href="/auth/login/forgot">Forgot password?</a>
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
        width: 18rem;
        display: flex;
        flex-direction: column;
    }

    input[type='email'],
    input[type='password'] {
        width: 100%;
    }

    button[type='submit'] {
        margin-top: 0.5rem;
    }

    .error {
        color: var(--color-error);
    }
</style>
