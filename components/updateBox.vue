<template>
    <div class="bg-white w-full h-full shadow-2xl p-6 rounded-lg overflow-y-auto relative">
        <!-- Bouton de fermeture -->
        <button class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer" @click="userStore.showUpdateBox = false">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        <div class="flex flex-col items-center space-y-6">
            <!-- Photo de profil -->
            <div class="rounded-full flex flex-col items-center gap-4">
                <CldImage
                    :src="'chatApp/'+ userStore.getUserData.value.avatarUrl"
                    width="200"
                    height="200"

                    class="rounded-full ring-2 ring-gray-200"
                    alt=""
                />
                <button v-if="isEditing" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    Changer l'avatar
                </button>
            </div>
            
            <div v-if="!isEditing" class="w-full max-w-md space-y-4">
                <!-- Affichage des informations -->
                <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-1">
                        <span class="text-gray-500 text-sm">Nom d'utilisateur</span>
                        <span class="text-gray-800 font-semibold">{{ userStore.getUserData.value.username }}</span>
                    </div>
                    
                    <div class="flex flex-col gap-1">
                        <span class="text-gray-500 text-sm">Email</span>
                        <span class="text-gray-800">{{ userStore.getUserData.value.email }}</span>
                    </div>
                    
                    <div class="flex flex-col gap-1">
                        <span class="text-gray-500 text-sm">Description</span>
                        <p class="text-gray-800">{{ userStore.getUserData.value.description }}</p>
                    </div>
                </div>

                <button 
                    @click="startEditing"
                    class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                >
                    Modifier les informations
                </button>
            </div>

            <!-- Formulaire de modification -->
            <form v-else @submit.prevent="updateUser" class="w-full max-y-md space-y-4">
                <!-- Nom d'utilisateur -->
                <div class="flex flex-col gap-2">
                    <label class="text-gray-700">Nom d'utilisateur</label>
                    <input 
                        v-model="formData.username"
                        type="text"
                        class="border rounded-lg p-2"
                        :placeholder="userStore.getUserData.value.username"
                    />
                </div>

                <!-- Email -->
                <div class="flex flex-col gap-2">
                    <label class="text-gray-700">Email</label>
                    <input 
                        v-model="formData.email"
                        type="email"
                        class="border rounded-lg p-2"
                        :placeholder="userStore.getUserData.value.email"
                    />
                </div>

                <!-- Description -->
                <div class="flex flex-col gap-2">
                    <label class="text-gray-700">Description</label>
                    <textarea 
                        v-model="formData.description"
                        class="border rounded-lg p-2 h-32"
                        :placeholder="userStore.getUserData.value.description"
                    ></textarea>
                </div>

                <!-- Section mot de passe -->
                <div class="border-t pt-4 mt-4">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-semibold text-gray-700">Modifier le mot de passe</h3>
                        <button 
                            type="button" 
                            @click="showPasswordSection = !showPasswordSection"
                            class="text-blue-500 hover:text-blue-600 text-sm"
                        >
                            {{ showPasswordSection ? 'Annuler' : 'Modifier' }}
                        </button>
                    </div>

                    <div v-if="showPasswordSection" class="space-y-4">
                        <div class="flex flex-col gap-2">
                            <label class="text-gray-700">Mot de passe actuel</label>
                            <input 
                                v-model="passwordData.currentPassword"
                                type="password"
                                class="border rounded-lg p-2"
                                placeholder="Entrez votre mot de passe actuel"
                            />
                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="text-gray-700">Nouveau mot de passe</label>
                            <input 
                                v-model="passwordData.newPassword"
                                type="password"
                                class="border rounded-lg p-2"
                                placeholder="Entrez votre nouveau mot de passe"
                            />
                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="text-gray-700">Confirmer le nouveau mot de passe</label>
                            <input 
                                v-model="passwordData.confirmPassword"
                                type="password"
                                class="border rounded-lg p-2"
                                placeholder="Confirmez votre nouveau mot de passe"
                            />
                        </div>

                        <p v-if="passwordError" class="text-red-500 text-sm">{{ passwordError }}</p>
                    </div>
                </div>

                <div class="flex gap-2">
                    <button 
                        type="button"
                        @click="cancelEditing"
                        class="w-1/2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
                    >
                        Annuler
                    </button>
                    <button 
                        type="submit"
                        class="w-1/2 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                    >
                        Sauvegarder
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { toast } from 'vue-sonner'


const userStore = useUserStore()
const apiUrl = useRuntimeConfig().public.apiUrl
const isEditing = ref(false)
const showPasswordSection = ref(false)
const passwordError = ref('')

const formData = ref({
    username: '',
    email: '',
    description: ''
})

const passwordData = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
})

// Même regex que dans signUpForm pour la cohérence
const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#€_\-])[A-Za-z\d@$!%*?&#€_\-]{8,}$/

const startEditing = () => {
    formData.value = {
        username: userStore.getUserData.value.username,
        email: userStore.getUserData.value.email,
        description: userStore.getUserData.value.description
    }
    isEditing.value = true
}

const cancelEditing = () => {
    isEditing.value = false
    showPasswordSection.value = false
    resetForms()
}

const resetForms = () => {
    formData.value = {
        username: '',
        email: '',
        description: ''
    }
    passwordData.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    }
    passwordError.value = ''
}

const validateForm = () => {
    // Validation du nom d'utilisateur
    if (formData.value.username && formData.value.username.length < 3) {
        toast.error("Le nom d'utilisateur doit contenir au moins 3 caractères")
        return false
    }

    // Validation de l'email
    if (formData.value.email && (!formData.value.email.includes('@') || !formData.value.email.includes('.'))) {
        toast.error('Veuillez saisir une adresse mail valide')
        return false
    }

    // Validation du mot de passe si la section est active
    if (showPasswordSection.value && 
        (passwordData.value.currentPassword || 
         passwordData.value.newPassword || 
         passwordData.value.confirmPassword)) {

        if (!passwordData.value.currentPassword) {
            toast.error('Le mot de passe actuel est requis')
            return false
        }

        if (!regexPassword.test(passwordData.value.newPassword)) {
            toast.error('Le mot de passe doit avoir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial')
            return false
        }

        if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
            toast.error('Les deux mots de passe ne correspondent pas')
            return false
        }
    }

    return true
}

const updateUser = async () => {
    if (!validateForm()) {
        resetForms()
        return
    }

    try {
        // Créer l'objet qui contiendra les données à mettre à jour
        const updatedData = {}

        // Vérifier chaque champ et l'ajouter uniquement s'il n'est pas vide
        if (formData.value.username) {
            updatedData.username = formData.value.username
        }
        if (formData.value.email) {
            updatedData.email = formData.value.email
        }
        if (formData.value.description) {
            updatedData.description = formData.value.description
        }

        // Ajouter les données du mot de passe si la section est active
        if (showPasswordSection.value && passwordData.value.currentPassword) {
            updatedData.currentPassword = passwordData.value.currentPassword
            updatedData.newPassword = passwordData.value.newPassword
        }

        // Si aucune donnée n'a été modifiée, on arrête
        if (Object.keys(updatedData).length === 0) {
            toast.error('Aucune modification n\'a été effectuée')
            return
        }

        // Envoi des données au serveur
        const response = await userStore.updateUser(updatedData)

        // Fermer le formulaire d'édition
        isEditing.value = false
        showPasswordSection.value = false
        resetForms()
        
        // Mettre à jour les données utilisateur dans le store
        await userStore.getUser()
        userStore.showUpdateBox = false
        toast.success('Informations mises à jour avec succès')

    } catch (error) {
        // Gestion des erreurs spécifiques
        switch (error.statusCode) {
            case 400:
                toast.error(error.data?.message || 'Données invalides')
                break
            case 401:
                toast.error('Mot de passe actuel incorrect')
                break
            case 409:
                toast.error('Cet email est déjà utilisé')
                break
            case 422:
                toast.error('Format de données incorrect')
                break
            case 500:
                toast.error('Erreur serveur, veuillez réessayer plus tard')
                break
            default:
                toast.error('Une erreur est survenue lors de la mise à jour')
        }
        resetForms()
    }
}
</script>




