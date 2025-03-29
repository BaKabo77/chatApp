import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
    const apiUrl = useRuntimeConfig().public.apiUrl
    
    // États
    const user = ref({
        id:null,
        email: null,
        username: null,
        avatarUrl: null,
        createdAt: null,
        lastLogin: null
    })
    const token = ref(null)
    const isAuthenticated = ref(false)
    const showUpdateBox = ref(false)

    // Actions
    const login = async (credentials) => {
        try {
            const response = await $fetch(apiUrl + 'auth/login', {
                method: 'POST',
                credentials: 'include',
                body: credentials
            })

            if (response.statusCode === 200) {
                user.value = response.data
                token.value = response.token
                isAuthenticated.value = true
                
                return {
                    success: true,
                    message: response.message,
                    statusCode: response.statusCode
                }
            }
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Erreur lors de la connexion',
                statusCode: error.statusCode
            }
        }
    }

    const updateUser = async (updatedData) => {
        try {
            const response = await $fetch(apiUrl + 'users/updateUser', {
                method: 'PUT',
                body: updatedData
            })

            if (response.statusCode === 200) {
                user.value = response.data
                return {
                    success: true,
                    message: response.message,
                    statusCode: response.statusCode
                }
            }
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Erreur lors de la mise à jour',
                statusCode: error.statusCode
            }   
        }
    }

    const getUser = async () => {
        try {
            const response = await $fetch(apiUrl + 'users/getUser', {
                method: 'GET'
            })

            if (response.statusCode === 200) {
                user.value = response.data
                return {
                    success: true,
                    message: response.message,
                    statusCode: response.statusCode
                }
            }       
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Erreur lors de la récupération des données',
                statusCode: error.statusCode
            }
        }
    }

    const logout = () => {
        user.value = {
            id:null,
            email: null,
            username: null,
            avatarUrl: null,
            createdAt: null,
            lastLogin: null
        }
        token.value = null
        isAuthenticated.value = false
    }

    const checkAuth = async () => {
        try {
            const session = await useUserSession()
            if (session.loggedIn) {
                user.value = session.user
                isAuthenticated.value = true

            }
        } catch (error) {
            console.error('Erreur lors de la vérification de l\'authentification:', error)
            logout()
        }
    }

    // Getters
    const getUserData = computed(() => user.value)
    const getIsAuthenticated = computed(() => isAuthenticated.value)
    const getToken = computed(() => token.value)

    return {
        user,
        token,
        isAuthenticated,
        showUpdateBox,
        login,
        logout,
        checkAuth,
        updateUser,
        getUserData,
        getIsAuthenticated,
        getToken
    }
})
