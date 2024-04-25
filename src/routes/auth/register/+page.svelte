<script lang="ts">
    export let form;
</script>

{#if form?.failed}<p>{form.message}</p>{/if}
{#if form?.invalid}<p>Email and password fields are required</p>{/if}
{#if form?.success}
    <div>
        <p>Account created!</p>
        <p>Check your inbox ({form.email}) to validate your account</p>
    </div>
{/if}

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
        Register:
        <input type="submit" />
    </label>
</form>

<a href="/auth/login">Login instead</a>
