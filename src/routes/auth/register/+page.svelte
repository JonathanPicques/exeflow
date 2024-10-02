<script lang="ts">
    let {form} = $props();
</script>

<svelte:head>
    <title>Exeflow - Register</title>
</svelte:head>

<nav>
    <a href="https://github.com/JonathanPicques/exeflow">Github</a>
</nav>

<main>
    <form method="POST">
        <h1>
            <a href="/">Exeflow</a>
        </h1>
        <input name="email" type="email" placeholder="Email" value={form?.email ?? ''} required />
        <input name="password" type="password" placeholder="Password" required />
        <input name="confirmPassword" type="password" placeholder="Confirm password" required />
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
    nav {
        top: 1rem;
        right: 1rem;
        position: absolute;
    }

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
