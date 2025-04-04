import { useUserStore } from '~/stores/user'

export default defineNuxtRouteMiddleware((to, from) => {


    const userStore = useUserStore()
    const {loggedIn,secure} = useUserSession()



    userStore.checkAuth()

})

