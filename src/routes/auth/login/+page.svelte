<script lang="ts">
    export let form;
</script>

{#if form?.failed}<p class="error">{form.message}</p>{/if}
{#if form?.invalid}<p class="error">Email and password fields are required</p>{/if}

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
        Login:
        <input type="submit" />
    </label>
</form>

<a href="/auth/register">Register instead</a>
