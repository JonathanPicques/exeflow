<script lang="ts">
    let {form} = $props();
</script>

<form method="POST">
    <label>
        Email:
        <input name="email" type="email" value={form?.email ?? ''} required />
    </label>
    <label>
        Password:
        <input name="password" type="password" required />
    </label>
    <label>
        <button type="submit">Login</button>
        <a href="/auth/register">Register instead</a>
    </label>
    {#if form?.failed}<p class="error">{form.message}</p>{/if}
    {#if form?.invalid}<p class="error">Email and password are required</p>{/if}
</form>

<style>
    form {
        gap: 0.6rem;
        display: flex;
        margin: 1.3rem auto;
        flex-direction: column;
    }

    input[type='email'],
    input[type='password'] {
        width: 100%;
    }
</style>
