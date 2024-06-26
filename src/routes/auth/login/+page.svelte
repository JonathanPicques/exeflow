<script lang="ts">
    let {form} = $props();
</script>

<main>
    <form method="POST">
        <h1>
            <a href="/">Exeflow</a>
        </h1>
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
