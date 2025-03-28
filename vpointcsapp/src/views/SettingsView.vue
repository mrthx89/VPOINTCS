<template>
  <div>
    <div class="space-y-12">
      <!-- WhatsApp Settings Section -->
      <div class="border-b border-gray-900/10 pb-12">
        <h2 class="text-base font-semibold leading-7 text-gray-900">Pengaturan WhatsApp</h2>
        <p class="mt-1 text-sm leading-6 text-gray-600">Konfigurasi koneksi WhatsApp dan pengaturan terkait.</p>

        <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div class="col-span-full">
            <div class="border rounded-lg bg-white p-6">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-medium text-gray-900">Status Koneksi</h3>
                  <p class="text-sm text-gray-500">
                    {{ whatsappStatus.connected ? 'Terhubung' : 'Tidak Terhubung' }}
                  </p>
                </div>
                <button
                  @click="scanQRCode"
                  :class="[
                    'rounded-md px-3 py-2 text-sm font-semibold',
                    whatsappStatus.connected
                      ? 'bg-red-600 text-white hover:bg-red-500'
                      : 'bg-primary-600 text-white hover:bg-primary-500'
                  ]"
                >
                  {{ whatsappStatus.connected ? 'Putuskan' : 'Hubungkan' }}
                </button>
              </div>

              <!-- QR Code Display -->
              <div v-if="showQR" class="mt-6">
                <div class="rounded-lg bg-gray-50 p-4">
                  <div class="text-sm text-gray-500 text-center mb-4">
                    Scan QR code ini dengan WhatsApp di ponsel Anda
                  </div>
                  <div class="flex justify-center">
                    <img
                      :src="qrCodeData"
                      alt="WhatsApp QR Code"
                      class="h-64 w-64"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Settings Section -->
      <div class="border-b border-gray-900/10 pb-12">
        <h2 class="text-base font-semibold leading-7 text-gray-900">Profil Pengguna</h2>
        <p class="mt-1 text-sm leading-6 text-gray-600">Informasi dan pengaturan akun Anda.</p>

        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div class="sm:col-span-3">
            <label for="username" class="block text-sm font-medium leading-6 text-gray-900">Username</label>
            <div class="mt-2">
              <input
                type="text"
                name="username"
                id="username"
                v-model="profile.username"
                class="input-field"
              />
            </div>
          </div>

          <div class="sm:col-span-3">
            <label for="name" class="block text-sm font-medium leading-6 text-gray-900">Nama Lengkap</label>
            <div class="mt-2">
              <input
                type="text"
                name="name"
                id="name"
                v-model="profile.name"
                class="input-field"
              />
            </div>
          </div>

          <div class="sm:col-span-4">
            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
            <div class="mt-2">
              <input
                type="email"
                name="email"
                id="email"
                v-model="profile.email"
                class="input-field"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Password Change Section -->
      <div class="border-b border-gray-900/10 pb-12">
        <h2 class="text-base font-semibold leading-7 text-gray-900">Ubah Password</h2>
        <p class="mt-1 text-sm leading-6 text-gray-600">Pastikan untuk menggunakan password yang kuat.</p>

        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div class="sm:col-span-3">
            <label for="current-password" class="block text-sm font-medium leading-6 text-gray-900">Password Saat Ini</label>
            <div class="mt-2">
              <input
                type="password"
                name="current-password"
                id="current-password"
                v-model="passwordChange.current"
                class="input-field"
              />
            </div>
          </div>

          <div class="sm:col-span-3">
            <label for="new-password" class="block text-sm font-medium leading-6 text-gray-900">Password Baru</label>
            <div class="mt-2">
              <input
                type="password"
                name="new-password"
                id="new-password"
                v-model="passwordChange.new"
                class="input-field"
              />
            </div>
          </div>

          <div class="sm:col-span-3">
            <label for="confirm-password" class="block text-sm font-medium leading-6 text-gray-900">Konfirmasi Password</label>
            <div class="mt-2">
              <input
                type="password"
                name="confirm-password"
                id="confirm-password"
                v-model="passwordChange.confirm"
                class="input-field"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 flex items-center justify-end gap-x-6">
      <button type="button" class="btn-secondary" @click="resetForm">Reset</button>
      <button type="button" class="btn-primary" @click="saveSettings">Simpan Perubahan</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const whatsappStatus = ref({
  connected: false,
  phone: null
})

const showQR = ref(false)
const qrCodeData = ref(null)

const profile = ref({
  username: '',
  name: '',
  email: ''
})

const passwordChange = ref({
  current: '',
  new: '',
  confirm: ''
})

// Load initial settings
const loadSettings = async () => {
  try {
    // TODO: Load WhatsApp status
    const whatsappResponse = await fetch('/api/whatsapp/status')
    const whatsappData = await whatsappResponse.json()
    whatsappStatus.value = whatsappData

    // TODO: Load user profile
    const profileResponse = await fetch('/api/user/profile')
    const profileData = await profileResponse.json()
    profile.value = profileData
  } catch (error) {
    console.error('Failed to load settings:', error)
    // TODO: Show error message
  }
}

const scanQRCode = async () => {
  try {
    if (whatsappStatus.value.connected) {
      // Disconnect WhatsApp
      const response = await fetch('/api/whatsapp/disconnect', {
        method: 'POST'
      })
      
      if (!response.ok) {
        throw new Error('Failed to disconnect WhatsApp')
      }

      whatsappStatus.value.connected = false
      showQR.value = false
      qrCodeData.value = null
    } else {
      // Connect WhatsApp
      const response = await fetch('/api/whatsapp/connect', {
        method: 'POST'
      })
      
      if (!response.ok) {
        throw new Error('Failed to initiate WhatsApp connection')
      }

      const data = await response.json()
      qrCodeData.value = data.qrCode
      showQR.value = true

      // Start polling for connection status
      const checkInterval = setInterval(async () => {
        const statusResponse = await fetch('/api/whatsapp/status')
        const statusData = await statusResponse.json()

        if (statusData.connected) {
          clearInterval(checkInterval)
          whatsappStatus.value = statusData
          showQR.value = false
          qrCodeData.value = null
        }
      }, 2000)
    }
  } catch (error) {
    console.error('WhatsApp connection error:', error)
    // TODO: Show error message
  }
}

const saveSettings = async () => {
  try {
    // Validate password change
    if (passwordChange.value.new) {
      if (passwordChange.value.new !== passwordChange.value.confirm) {
        throw new Error('Password baru tidak cocok dengan konfirmasi')
      }

      // TODO: Update password
      await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordChange.value.current,
          newPassword: passwordChange.value.new
        })
      })
    }

    // Update profile
    await fetch('/api/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profile.value)
    })

    // TODO: Show success message
  } catch (error) {
    console.error('Failed to save settings:', error)
    // TODO: Show error message
  }
}

const resetForm = () => {
  loadSettings()
  passwordChange.value = {
    current: '',
    new: '',
    confirm: ''
  }
}

// Load settings on component mount
loadSettings()
</script>