<script lang="ts">
    import Logo from '$lib/core/widgets/Logo.svelte';
    import Navbar from '$lib/core/widgets/Navbar.svelte';
    import GithubLink from '$lib/core/widgets/GithubLink.svelte';

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
    <form method="post">
        <Logo flow="horizontal" imgSize="4rem" textSize="3rem" transition={true} />
        <label for="email">Email</label>
        <input id="email" name="email" type="email" value={form?.email ?? ''} placeholder="Enter your email address…" autocomplete="email" required />
        <button type="submit">Send</button>
        <a href="/auth/login">Login instead</a>
        {#if form?.error}
            <p class="error">
                {form.error.message}
            </p>
        {:else if form?.success}
            <p class="success">
                If your account exists, an email with a link to reset your password is on its way to your
                {#if form.success.inbox}<a href={form.success.inbox}>inbox</a>{:else}inbox{/if}.
            </p>
        {/if}
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

    input[type='email'] {
        width: 100%;
    }

    button[type='submit'] {
        margin-top: 0.5rem;
    }

    .error {
        color: var(--color-error);
    }
    .success {
        color: var(--color-success);
    }
</style>
