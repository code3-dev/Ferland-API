<template>
  <div v-if="isLoggedIn">
    <div class="p-6 max-w-lg mx-auto bg-white rounded-md shadow-md">
      <h1 class="text-2xl font-bold mb-6">Create a Meme</h1>
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label for="type" class="block font-semibold">Type:</label>
          <select v-model="form.type" required class="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300">
            <option value="" disabled>Select Type</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>
        <div>
          <label for="title" class="block font-semibold">Title:</label>
          <input v-model="form.title" type="text" id="title" required class="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300">
        </div>
        <div>
          <label for="description" class="block font-semibold">Description:</label>
          <textarea v-model="form.description" id="description" class="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"></textarea>
        </div>
        <div>
          <label for="image" class="block font-semibold">Image URL:</label>
          <input v-model="form.image" type="url" id="image" required class="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300">
        </div>
        <div v-if="form.type === 'video'">
          <label for="video" class="block font-semibold">Video URL:</label>
          <input v-model="form.video" type="url" id="video" required class="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300">
        </div>
        <div>
          <label for="height" class="block font-semibold">Height:</label>
          <input v-model.number="form.height" type="number" id="height" required class="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300">
        </div>
        <div>
          <label for="padding" class="block font-semibold">Padding:</label>
          <input v-model.number="form.padding" type="number" id="padding" required class="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300">
        </div>
        <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200">Create Meme</button>
      </form>
      <div v-if="errorMessage" class="mt-4">
        <p class="text-red-500">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="p-6 max-w-lg mx-auto bg-white rounded-md shadow-md">
      <h1 class="text-2xl font-bold mb-6">Login</h1>
      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label for="username" class="block font-semibold">Username:</label>
          <input v-model="credentials.username" type="text" id="username" required class="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300">
        </div>
        <div>
          <label for="password" class="block font-semibold">Password:</label>
          <input v-model="credentials.password" type="password" id="password" required class="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300">
        </div>
        <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200">Login</button>
      </form>
      <div v-if="loginError" class="mt-4">
        <p class="text-red-500">{{ loginError }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

useHead({
  title: 'Admin Panel',
  meta: [
    { name: 'description', content: 'Admin Panel for Ferland' }
  ],
});

const form = ref({
  type: '',
  title: '',
  description: '',
  image: '',
  video: '',
  height: 0,
  padding: 0,
})

const credentials = ref({
  username: '',
  password: ''
})

const errorMessage = ref('')
const loginError = ref('')
const isLoggedIn = ref(false)

const submitForm = async () => {
  try {
    const response = await fetch('/api/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-password': localStorage.getItem('token'),
      },
      body: JSON.stringify(form.value),
    })

    if (!response.ok) {
      throw new Error('Failed to create meme')
    }

    const result = await response.json()
    alert('Meme created successfully.')
    console.log('Meme created successfully:', result)
  } catch (error) {
    alert(error.message)
    errorMessage.value = error.message
  }
}

const login = async () => {
  try {
    const response = await fetch('/api/password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials.value),
    })

    if (!response.ok) {
      throw new Error('Login failed')
    }

    const result = await response.json()
    if (result.statusCode === 200) {
      localStorage.setItem('username', credentials.value.username)
      localStorage.setItem('password', credentials.value.password)
      localStorage.setItem('token', result.apiToken)
      isLoggedIn.value = true
    } else {
      loginError.value = 'Invalid username or password'
    }
  } catch (error) {
    loginError.value = error.message
  }
}

if (process.client && localStorage.getItem('username') && localStorage.getItem('password')) {
  credentials.value.username = localStorage.getItem('username')
  credentials.value.password = localStorage.getItem('password')
  login()
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
}

label {
  margin-top: 10px;
}

input,
textarea,
select {
  margin-bottom: 10px;
  padding: 5px;
}

button {
  margin-top: 20px;
  padding: 10px;
}
</style>