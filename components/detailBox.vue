<template>
    <div class="bg-white w-full h-full shadow-2xl p-6 rounded-lg overflow-y-auto relative">
        <!-- Bouton de fermeture -->
        <button class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer" @click="selectedUserStore.showDetailBox = false">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        <div class="flex flex-col items-center space-y-6">
            <!-- Photo de profil -->
            <div class="flex justify-center">
                <CldImage
                    :src="'chatApp/'+ selectedUser.avatar_url" 
                    width="256"
                    height="256"
                    crop="fill"
                    class="w-24 h-24 rounded-full ring-2 ring-gray-200 object-cover"
                    alt=""
                />
            </div>
            
            <!-- Informations utilisateur -->
            <div class="w-full max-w-md space-y-4">
                <!-- Nom d'utilisateur -->
                <div class="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-gray-800 font-semibold">{{ selectedUser.username }}</span>
                </div>

                <!-- Email -->
                <div class="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span class="text-gray-600">{{ selectedUser.email }}</span>
                </div>

                <!-- Date de création -->
                <div class="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-gray-600">Membre depuis le {{ selectedUser.created_at.slice(0, 10) }}</span>
                </div>

                <!-- Description -->
                <div class="mt-4">
                    <p class="text-gray-600 text-sm leading-relaxed">
                        {{ selectedUser.description }}
                    </p>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script setup>

const selectedUserStore = useSelectedUserStore()

const selectedUser = computed(() => selectedUserStore.getUser)

</script>