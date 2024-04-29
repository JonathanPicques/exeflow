<script lang="ts">
    export let form;
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
        Confirm Password:
        <input name="confirmPassword" type="password" required />
    </label>
    <label>
        <button type="submit">Register</button>
        <a href="/auth/login">Login instead</a>
    </label>

    {#if form?.failed}<p>{form.message}</p>{/if}
    {#if form?.invalid}<p>Email and password fields are required</p>{/if}
    {#if form?.success}
        <p>Account created! Check your inbox ({form.email}) to validate your account</p>
    {/if}
</form>

<style>
    form {
        display: flex;
        flex-direction: column;

        gap: 10px;
        margin: 20px auto;
    }

    input[type='email'],
    input[type='password'] {
        width: 100%;
    }
</style>
