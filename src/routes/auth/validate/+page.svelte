<script lang="ts">
    export let data;
</script>

<div>
    {#if data.success}
        <h1>Your account is validated!</h1>
        <ul>
            <li><a href="/">Start automating!</a></li>
        </ul>
    {/if}
    {#if data.error}
        <h1>There was an error while validating your account!</h1>
        <p>Error #{data.code}</p>
        <p>{data.description}</p>
    {/if}
</div>
