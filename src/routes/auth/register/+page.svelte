<script lang="ts">
    export let form;
</script>

{#if form?.failed}<p>{form.message}</p>{/if}
{#if form?.invalid}<p>Email field is required</p>{/if}
{#if form?.success}
    <div>
        <p>Account linked!</p>
        <p>Check your inbox ({form.email}) to setup a password</p>
    </div>
{/if}

<form method="POST">
    <label>
        Email:
        <input name="email" type="email" value={form?.email ?? ''} required />
    </label>
    <label>
        Link account:
        <input type="submit" />
    </label>
</form>

<a href="/auth/login">Login instead</a>
