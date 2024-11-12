<script lang="ts">
    import Logo from '../../widgets/Logo.svelte';
    import Navbar from '../../widgets/Navbar.svelte';
    import GithubLink from '../../widgets/GithubLink.svelte';

    let {form} = $props();
</script>

<svelte:head>
    <title>Exeflow - Register</title>
</svelte:head>

<Navbar>
    {#snippet right()}
        <GithubLink />
    {/snippet}
</Navbar>

<main>
    <form method="post">
        <Logo flow="horizontal" imgSize="4rem" textSize="3rem" />
        <label for="email">Email</label>
        <input id="email" name="email" type="email" value={form?.email ?? ''} placeholder="Enter your email address…" autocomplete="email" required />
        <label for="password">Password</label>
        <input id="password" name="password" type="password" placeholder="Enter your password…" autocomplete="new-password" required />
        <label for="confirmPassword">Confirm password</label>
        <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm your password…" autocomplete="new-password" required />
        <button type="submit">Register</button>
        <a href="/auth/login">Login instead</a>

        {#if form?.failed}<p>{form.message}</p>{/if}
        {#if form?.invalid}<p>Email and password fields are required</p>{/if}
        {#if form?.success}
            <p>Account created! Check your inbox ({form.email}) to validate your account</p>
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

    input[type='email'],
    input[type='password'] {
        width: 100%;
    }

    button[type='submit'] {
        margin-top: 0.5rem;
    }
</style>
