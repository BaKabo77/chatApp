import { useUserStore } from '~/stores/user'

export default defineNuxtRouteMiddleware((to, from) => {


    const userStore = useUserStore()
    const {loggedIn,secure} = useUserSession()


    if (!loggedIn.value) {
        console.log('retour a la la connexion')
        return navigateTo('/')
    }


    userStore.checkAuth()

})

