<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="bg-white rounded md:mx-40 lg:mx-80 pb-8 py-5 px-8">
      <div class="sm:mx-auto sm:max-w-sm">
        <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Créer un compte</h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label for="username" class="block text-sm/6 font-medium text-gray-900">Nom d'utilisateur</label>
            <div class="mt-2">
              <input 
                v-model="username" 
                type="text" 
                id="username" 
                required
                minlength="3"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" 
              />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm/6 font-medium text-gray-900">Adresse mail</label>
            <div class="mt-2">
              <input 
                v-model="email" 
                type="email" 
                id="email" 
                required
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" 
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm/6 font-medium text-gray-900">Mot de passe</label>
            <div class="mt-2">
              <input 
                v-model="password" 
                type="password" 
                id="password" 
                required
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" 
              />
            </div>
          </div>

          <div>
            <label for="confirm-password" class="block text-sm/6 font-medium text-gray-900">Confirmer le mot de passe</label>
            <div class="mt-2">
              <input 
                v-model="confirmPassword" 
                type="password" 
                id="confirm-password" 
                required
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" 
              />
            </div>
          </div>

          <div>
            <button 
              type="submit"
              @click.prevent="submit" 
              class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              S'inscrire
            </button>
          </div>
        </form>

        <p class="mt-10 text-center text-sm/6 text-gray-500">
          Déjà inscrit ?
          <NuxtLink to="/" class="font-semibold text-indigo-600 hover:text-indigo-500">
            Se connecter
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toast } from 'vue-sonner';

const username = ref('')
const router = useRouter()
const apiUrl = useRuntimeConfig().public.apiUrl
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#€_\-])[A-Za-z\d@$!%*?&#€_\-]{8,}$/

const submit = async () => {
  
    if(username.value.length < 3) {
        toast.error('Le nom d\'utilisateur doit contenir au moins 3 caractères')
        username.value = ''
        email.value = ''
        password.value = ''
        confirmPassword.value = ''
        return
    }

    if(!email.value.includes('@') || !email.value.includes('.')){
        toast.error('veuillez saisir une adresse mail valide')
        username.value = ''
        email.value = ''
        password.value = ''
        confirmPassword.value = ''
        return
    }

    if(!regexPassword.test(password.value)){
        toast.error('le mot de passe doit avoir au moins 8 characteres, une majuscule, une minuscule et un chiffre')
        username.value = ''
        email.value = ''
        password.value = ''
        confirmPassword.value = ''
        return
    }

    if(password.value !== confirmPassword.value){
        toast.error("les deux mots de passes ne correspondent pas")
        username.value = ''
        email.value = ''
        password.value = ''
        confirmPassword.value = ''
        return
    }

    const body = {
        username:username.value,
        email:email.value,
        password:password.value
    }

    try{

        const data = await $fetch(apiUrl+'auth/register',{
        method:'POST',
        body:body
        })

        toast.success('informations correctes')
        router.push('/')
        

    }catch(error){
        
        // Gestion des erreurs spécifiques
    switch (error.statusCode) {
      case 400:
        toast.error(error.data?.message || 'Données invalides')
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
        toast.error("Une erreur est survenue lors de l'inscription")
    }
    }
    

}
</script>