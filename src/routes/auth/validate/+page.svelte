<script lang="ts">
    export let form;
</script>

{#if form?.failed}<p>{form.message}</p>{/if}
{#if form?.invalid}<p>Passswords required or don't match!</p>{/if}
{#if form?.success}<p>Account password updated!</p>{/if}

<form method="POST">
    <label>
        Password:
        <input name="password" type="password" required />
    </label>
    <label>
        Confirm Password:
        <input name="confirmPassword" type="password" required />
    </label>
    <label>
        Finalize register:
        <input type="submit" />
    </label>
</form>
