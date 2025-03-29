<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div v-if="!loading" class="bg-white rounded md:mx-40 lg:mx-80 pb-8 py-5 px-8">
      <div class="sm:mx-auto sm:max-w-sm">
        <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Connectez-vous</h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form  class="space-y-6" @submit.prevent="handleSubmit">
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
            <button 
              type="submit" 
              class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Se connecter
            </button>
          </div>
        </form>

        

        <p class="mt-10 text-center text-sm/6 text-gray-500">
          Pas encore inscrit ?
          <NuxtLink to="/inscription" class="font-semibold text-indigo-600 hover:text-indigo-500">
            Commencer dès maintenant
          </NuxtLink>
        </p>
      </div>
    </div>

    <div v-else>
          <CircleLoader class="mx-auto w-10 h-10" color="white"></CircleLoader> 
        </div>
  </div>
</template>

<script setup>
import { toast } from 'vue-sonner'
import CircleLoader from 'vue-spinner/src/MoonLoader.vue'


const email = ref('')
const password = ref('')
const router = useRouter()
const apiUrl = useRuntimeConfig().public.apiUrl
const userStore = useUserStore()
const {loggedIn, user,secure} = useUserSession()
const loading = ref(false)

const handleSubmit = async ()=>{
  try{
    loading.value = true
  const data = await userStore.login({email:email.value,password:password.value})

  if(data.statusCode === 401){
    toast.error('identifiants incorrectes')
    loading.value = false
    return
  }

  if(data.statusCode === 409){
    toast.error("cet adresse email n'est attribué à aucun compte")
    loading.value = false
    return
  }

  if(data.statusCode === 200){
    toast.success(data.message + ", vous etes bien connecté !")
    router.push('/accueil')
    loading.value = false
  }


  }catch(error){
    
    toast.error(error.message)
    console.log(error.message + " " + error.statusCode)
    loading.value = false
    return

  }
  

}
</script>