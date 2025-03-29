import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSelectedUserStore = defineStore('selectedUser', () => {


    const user = ref({
        id:null,
        email: null,
        username: null,
        avatarUrl: null,
        createdAt: null,
        lastLogin: null
    })

    const showDetailBox = ref(false)

    const setUser = (userData) => {
        user.value = userData
    }

    const getUser = computed(() => user.value)

    const clearUser = () => {
        user.value = {
            id:null,
            email: null,
            username: null,
            avatarUrl: null,
        }
    }

    return { user, setUser, getUser, clearUser, showDetailBox }

})
