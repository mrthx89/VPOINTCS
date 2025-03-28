<template>
  <div>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <!-- WhatsApp Connection Status -->
      <div class="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
        <dt>
          <div class="absolute rounded-md bg-primary-500 p-3">
            <PhoneIcon class="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <p class="ml-16 truncate text-sm font-medium text-gray-500">Status WhatsApp</p>
        </dt>
        <dd class="ml-16 flex items-baseline pb-6 sm:pb-7">
          <p class="text-2xl font-semibold text-gray-900">Terhubung</p>
          <div class="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
            <div class="text-sm">
              <button
                class="btn-primary w-full"
                @click="scanQRCode"
              >
                Scan QR Code
              </button>
            </div>
          </div>
        </dd>
      </div>

      <!-- Total Incoming Messages -->
      <div class="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
        <dt>
          <div class="absolute rounded-md bg-primary-500 p-3">
            <InboxIcon class="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <p class="ml-16 truncate text-sm font-medium text-gray-500">Pesan Masuk Hari Ini</p>
        </dt>
        <dd class="ml-16 flex items-baseline pb-6 sm:pb-7">
          <p class="text-2xl font-semibold text-gray-900">24</p>
          <p class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
            <ArrowUpIcon class="h-5 w-5 flex-shrink-0 self-center text-green-500" aria-hidden="true" />
            <span class="sr-only"> Increased by </span>
            12%
          </p>
        </dd>
      </div>

      <!-- Total Outgoing Messages -->
      <div class="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
        <dt>
          <div class="absolute rounded-md bg-primary-500 p-3">
            <PaperAirplaneIcon class="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <p class="ml-16 truncate text-sm font-medium text-gray-500">Pesan Keluar Hari Ini</p>
        </dt>
        <dd class="ml-16 flex items-baseline pb-6 sm:pb-7">
          <p class="text-2xl font-semibold text-gray-900">18</p>
          <p class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
            <ArrowUpIcon class="h-5 w-5 flex-shrink-0 self-center text-green-500" aria-hidden="true" />
            <span class="sr-only"> Increased by </span>
            8%
          </p>
        </dd>
      </div>

      <!-- Active Customers -->
      <div class="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
        <dt>
          <div class="absolute rounded-md bg-primary-500 p-3">
            <UsersIcon class="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <p class="ml-16 truncate text-sm font-medium text-gray-500">Pelanggan Aktif</p>
        </dt>
        <dd class="ml-16 flex items-baseline pb-6 sm:pb-7">
          <p class="text-2xl font-semibold text-gray-900">12</p>
          <p class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
            <ArrowUpIcon class="h-5 w-5 flex-shrink-0 self-center text-green-500" aria-hidden="true" />
            <span class="sr-only"> Increased by </span>
            4%
          </p>
        </dd>
      </div>
    </div>

    <!-- Recent Messages -->
    <div class="mt-8">
      <div class="rounded-lg bg-white shadow">
        <div class="p-6">
          <h3 class="text-base font-semibold leading-6 text-gray-900">Pesan Terbaru</h3>
          <div class="mt-4 flow-root">
            <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table class="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Pelanggan</th>
                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Pesan</th>
                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Waktu</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <tr v-for="message in recentMessages" :key="message.id">
                      <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{{ message.customer }}</td>
                      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ message.content }}</td>
                      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span :class="[message.status === 'Terkirim' ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50', 'inline-flex rounded-full px-2 text-xs font-semibold leading-5']">{{ message.status }}</span>
                      </td>
                      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ message.time }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { PhoneIcon, InboxIcon, PaperAirplaneIcon, UsersIcon, ArrowUpIcon } from '@heroicons/vue/24/outline'

const recentMessages = ref([
  {
    id: 1,
    customer: 'John Doe',
    content: 'Halo, saya ingin bertanya tentang produk...',
    status: 'Terkirim',
    time: '5 menit yang lalu'
  },
  {
    id: 2,
    customer: 'Jane Smith',
    content: 'Terima kasih atas bantuannya',
    status: 'Menunggu',
    time: '10 menit yang lalu'
  },
  // Add more sample messages here
])

const scanQRCode = async () => {
  try {
    // TODO: Implement QR code scanning logic
    const response = await fetch('/api/whatsapp/scan', {
      method: 'POST'
    })
    
    if (!response.ok) {
      throw new Error('Failed to initiate QR scan')
    }
    
    // Handle successful scan initiation
  } catch (error) {
    console.error('QR scan error:', error)
    // TODO: Show error message to user
  }
}
</script>