<script lang="ts">
    import Avatar from '$lib/core/widgets/icons/Avatar.svelte';
</script>

<a href="/auth/profile" class="icon button" title="Your profile">
    <Avatar />
</a>

<style>
    a {
        view-transition-name: profile-link;
    }
</style>
