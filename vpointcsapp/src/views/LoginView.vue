<template>
  <div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-dark-200">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h1 class="text-center text-3xl font-bold tracking-tight text-white">VPoint CS</h1>
      <h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-white">Masuk ke Akun Anda</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div class="bg-dark-100 px-6 py-12 shadow-lg shadow-dark-300/50 sm:rounded-lg sm:px-12 border border-dark-300">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label for="username" class="block text-sm font-medium leading-6 text-gray-200">Username</label>
            <div class="mt-2">
              <input
                id="username"
                v-model="username"
                name="username"
                type="text"
                required
                class="block w-full rounded-md border-0 py-1.5 bg-dark-300 text-white shadow-sm ring-1 ring-inset ring-dark-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium leading-6 text-gray-200">Password</label>
            <div class="mt-2">
              <input
                id="password"
                v-model="password"
                name="password"
                type="password"
                required
                class="block w-full rounded-md border-0 py-1.5 bg-dark-300 text-white shadow-sm ring-1 ring-inset ring-dark-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="rememberMe"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 rounded border-dark-300 bg-dark-300 text-primary-500 focus:ring-primary-500"
              />
              <label for="remember-me" class="ml-3 block text-sm leading-6 text-gray-200">Ingat Saya</label>
            </div>

            <div class="text-sm leading-6">
              <a href="#" class="font-semibold text-primary-400 hover:text-primary-300">Lupa password?</a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="flex w-full justify-center rounded-md bg-primary-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isLoading ? 'Memproses...' : 'Masuk' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const isLoading = ref(false)

const handleLogin = async () => {
  try {
    isLoading.value = true
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'Login gagal')
    }
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))

    // Setelah login berhasil, redirect ke halaman utama
    router.push('/')
  } catch (error) {
    console.error('Login error:', error)
    alert(error.message || 'Terjadi kesalahan saat login. Silakan coba lagi.')
  } finally {
    isLoading.value = false
  }
}
</script>