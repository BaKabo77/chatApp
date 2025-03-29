<template>
    <div class="bg-white w-full h-full shadow-2xl p-4 rounded-lg overflow-y-auto relative">
        <!-- Bouton de fermeture -->
        <button class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer" @click="selectedUserStore.clearUser()">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        <div @click="selectedUserStore.showDetailBox = true" class="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-lg">
            <CldImage
                src="default-avatar"
                width="48"
                height="48"
                class="w-12 h-12 rounded-full ring-2 ring-white" 
                alt="Photo de profil"
            />
            <p class="ml-4 border-l-2 border-gray-300 pl-4 text-lg">{{ selectedUserStore.getUser.username }}</p>
        </div>

        <div class="h-4/5 bg-gray-200 rounded-lg p-4 overflow-y-auto"> 
           <div v-for="message in getMessages" :key="message.id">
                <div class="flex mb-4" :class="message.sender_id === userStore.getUserData.value.id ? 'justify-end' : 'justify-start'">
                    <div class="flex items-start max-w-[70%]" :class="message.sender_id === userStore.getUserData.value.id ? 'flex-row-reverse' : 'flex-row'">
                        <CldImage 
                            width="32"
                            height="32"
                            class="w-8 h-8 rounded-full ring-2 ring-white" 
                            :src="message.sender_id === userStore.getUserData.value.id ? 'chatApp/'+ userStore.getUserData.value.avatarUrl : 'chatApp/'+ selectedUserStore.getUser.avatar_url"
                            :alt="message.sender_id === userStore.getUserData.value.id ? userStore.getUserData.value.username : selectedUserStore.getUser.username"
                        />
                        <div 
                            class="px-4 py-2 rounded-lg mx-2"
                            :class="message.sender_id === userStore.getUserData.value.id ? 'bg-blue-500 text-white' : 'bg-white'"
                        >
                            {{ message.content }}
                        </div>
                        <p class="text-xs text-gray-500">{{ new Date(message.timestamp).toLocaleString('fr-FR') }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex items-center justify-between mt-4">
            <input type="text" v-model="message" class="w-full p-2 rounded-lg border border-gray-300" placeholder="Message...">
            <button @click="sendMessages" class="bg-blue-500 text-white px-4 py-2 rounded-lg">Envoyer</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useNuxtApp } from '#app'
import { useSelectedUserStore } from '@/stores/selectedUser'
import { useUserStore } from '@/stores/user'
import { toast } from 'vue-sonner'
import { ref as dbRef, set, onValue, get, push, off } from "firebase/database"

const { $database } = useNuxtApp()
const message = ref('')
const selectedUserStore = useSelectedUserStore()
const userStore = useUserStore()
const Messages = ref([])

// Référence pour stocker le détachement de l'écouteur
const currentListener = ref(null)

// Création d'un ID de conversation unique et trié
const conversationId = computed(() => {
  const idUser = userStore.getUserData.value.id?.toString()
  const idSelectedUser = selectedUserStore.getUser.id?.toString()
  
  if (!idUser || !idSelectedUser) return null
  
  // Trie les IDs pour garantir la cohérence
  return [idUser, idSelectedUser].sort().join('_')
})

// Référence à la conversation
const getConversationRef = computed(() => {
  if (!conversationId.value) return null
  return dbRef($database, `conversations/${conversationId.value}`)
})

// Référence aux messages
const getMessagesRef = computed(() => {
  if (!conversationId.value) return null
  return dbRef($database, `conversations/${conversationId.value}/messages`)
})

// Propriété calculée des messages
const getMessages = computed(() => {
  return Messages.value
})

// Fonction pour détacher l'écouteur précédent
function detachCurrentListener() {
  if (currentListener.value) {
    off(currentListener.value)
    currentListener.value = null
  }
}

// Fonction pour configurer l'écouteur de messages
function setupMessageListener() {
  try {
    // Détacher l'écouteur précédent s'il existe
    detachCurrentListener()
    
    // Réinitialiser les messages
    Messages.value = []
    
    if (!getMessagesRef.value) {
      console.error('Référence des messages non disponible')
      return
    }

    // Stocker la référence pour pouvoir la détacher plus tard
    currentListener.value = getMessagesRef.value
    
    onValue(getMessagesRef.value, (snapshot) => {
      if (snapshot.exists()) {
        // Convertir les messages en tableau et les trier par timestamp
        const messagesData = []
        snapshot.forEach((childSnapshot) => {
          messagesData.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          })
        })
        
        // Trier les messages par timestamp
        Messages.value = messagesData.sort((a, b) => a.timestamp - b.timestamp)
      } else {
        Messages.value = []
        console.log("Aucun message dans cette conversation.")
      }
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error)
    toast.error('Erreur lors de la récupération des messages')
  }
}

// Observer les changements de l'utilisateur sélectionné
watch(() => selectedUserStore.getUser.id, (newId, oldId) => {
  if (newId !== oldId) {
    // Réinitialiser les messages et reconfigurer l'écouteur
    Messages.value = []
    if (conversationId.value) {
      setupMessageListener()
    }
  }
}, { immediate: true })

// Fonction pour envoyer un message
async function sendMessages() {
  try {
    if (!message.value.trim() || !conversationId.value) {
      toast.error('Message vide ou conversation invalide')
      return
    }

    if (!getConversationRef.value || !getMessagesRef.value) {
      console.error('Références Firebase non disponibles')
      return
    }

    // Vérifier si la conversation existe
    const conversationSnapshot = await get(getConversationRef.value)
    if (!conversationSnapshot.exists()) {
      // Créer la conversation avec les participants
      await set(getConversationRef.value, {
        participants: [
          userStore.getUserData.value.id,
          selectedUserStore.getUser.id
        ],
        createdAt: Date.now()
      })
    }

    // Ajouter le message
    const newMessageRef = push(getMessagesRef.value)
    await set(newMessageRef, {
      sender_id: userStore.getUserData.value.id,
      content: message.value,
      timestamp: Date.now()
    })

    // Réinitialiser le champ message
    message.value = ''
    toast.success('Message envoyé')

  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error)
    toast.error("Erreur lors de l'envoi du message")
  }
}

// Nettoyage lors de la destruction du composant
onUnmounted(() => {
  detachCurrentListener()
})
</script>