<template>
    <div class="flex flex-col lg:flex-row w-full h-screen p-4 gap-4">
        <ProfileBox class="lg:w-1/4 lg:h-full" />
        <MessageBox v-if="selectedUserStore.getUser.username" class="lg:w-2/4 h-3/5 lg:h-full" />
        <DetailBox v-if="selectedUserStore.showDetailBox" class="hidden lg:block lg:w-1/4 lg:h-full" />
        <UpdateBox v-else-if="userStore.showUpdateBox" class="hidden lg:block lg:w-1/4 lg:h-full" />
    </div>
</template>

<script setup>

const userStore = useUserStore()
const selectedUserStore = useSelectedUserStore()

definePageMeta({
    layout: 'menus',
    middleware:['auth-user']
})
</script>