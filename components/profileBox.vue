<template>
    <div class="bg-white w-full shadow-2xl p-4 rounded-lg overflow-y-auto">
        <!-- Section profil -->
        <div class="flex items-center mb-4 hover:bg-gray-100 cursor-pointer" @click="userStore.showUpdateBox = true">
            <CldImage 
                width="50"
                height="50"
                quality="auto"
                format="auto"
                class="rounded-full ring-2 ring-gray-200 my-3" 
                :src="'chatApp/'+ userStore.getUserData.value.avatarUrl" 
                :alt="userStore.getUserData.value.avatarUrl"
            />
            <p class="ml-4 border-l-2 border-gray-300 pl-4 text-sm md:text-base lg:text-lg">{{ userStore.getUserData.value.username }}</p>
        </div>

        <!-- Barre de recherche -->
        <form class="flex flex-col sm:flex-row gap-2 pb-4" @submit.prevent="searchData" >
            <select class="px-4 py-2 bg-gray-100 border rounded-lg text-sm w-full sm:w-auto" v-model="searchType" @change="searchType = $event.target.value">
                <option value="users">Tous les utilisateurs</option>
                <option value="friends">Amis</option>
                <option value="groups">Groupes</option>
            </select>
            
            <div class="relative flex-1">
                <input type="search" class="w-full p-2 border rounded-lg pr-12" placeholder="Rechercher..." v-model="search">
                <button type="submit" class="absolute right-0 top-0 h-full px-4 bg-blue-700 text-white rounded-r-lg hover:bg-blue-800">
                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </button>
            </div>
        </form>

        <!-- Liste des utilisateurs -->
        <div class="mt-4 lg:mt-0 lg:flex-1 lg:h-4/5 overflow-y-auto">
            <div class="overflow-x-auto lg:overflow-y-auto">
                <div class="flex lg:block space-x-4 lg:space-x-0 lg:space-y-2 pb-2 md:pb-0">

                    <div v-if="searchResults.length === 0">
                        <p class="text-gray-500 text-center">Aucun résultat trouvé</p>
                    </div>
                    
                    <div
                        @click="getSelectedUser(result)"
                        v-else
                        v-for="result in searchResults" 
                        :key="result.id" 
                        class="flex items-center shrink-0 lg:shrink p-2 lg:p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 cursor-pointer px-4 mx-4"
                    >
                        <CldImage
                            :src="'chatApp/'+ result.avatar_url"
                            width="40"
                            height="40"
                            alt="Photo de profil"
                            class="w-12 h-12 rounded-full ring-2 ring-gray-200"
                        />


                        <div class="ml-2 lg:ml-4 flex-1">
                            <p class="text-gray-900 font-medium text-sm md:text-base"> {{ result.username }}</p>
                            <p class="hidden lg:block text-sm text-gray-500">En ligne</p>
                        </div>
                        <button class="hidden lg:block text-blue-600 hover:text-blue-800" >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                            </svg>
                        </button>
                    </div>


                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import { toast } from 'vue-sonner'
import CircleLoader from 'vue-spinner/src/MoonLoader.vue'


const userStore = useUserStore()
const selectedUserStore = useSelectedUserStore()

const {loggedIn,user,secure} = useUserSession()
const apiUrl = useRuntimeConfig().public.apiUrl

const search = ref('')
const searchType = ref('')
const searchResults = ref([])
const loading = ref(false)

const searchData = async () => {

    if(searchType.value === ''){
        toast.error('Veuillez selectionner un type de recherche')
        return
    }
  
    const data = await $fetch(`${apiUrl}search/${searchType.value}`, {
        method: 'POST',
        body: { search: search.value }
    })
    searchResults.value = data
}

const getSelectedUser = (user) => {
    selectedUserStore.setUser(user)
}


</script>