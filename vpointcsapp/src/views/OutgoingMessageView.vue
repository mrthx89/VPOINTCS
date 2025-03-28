<template>
  <div>
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900">Pesan Keluar</h1>
        <p class="mt-2 text-sm text-gray-700">Daftar semua pesan WhatsApp yang telah dikirim ke pelanggan.</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <div class="flex space-x-4">
          <div class="relative">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Cari pesan..."
              class="input-field w-64"
            />
          </div>
          <select v-model="filterStatus" class="input-field w-40">
            <option value="">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="sent">Terkirim</option>
            <option value="delivered">Diterima</option>
            <option value="read">Dibaca</option>
          </select>
        </div>
      </div>
    </div>

    <div class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Pelanggan</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Pesan</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Waktu</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Aksi</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="message in filteredMessages" :key="message.id">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                    <div class="flex items-center">
                      <div class="h-10 w-10 flex-shrink-0">
                        <UserCircleIcon class="h-10 w-10 text-gray-300" aria-hidden="true" />
                      </div>
                      <div class="ml-4">
                        <div class="font-medium text-gray-900">{{ message.customer }}</div>
                        <div class="text-gray-500">{{ message.phone }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-3 py-4 text-sm text-gray-500">
                    <div class="max-w-md">
                      <p class="truncate">{{ message.content }}</p>
                      <span v-if="message.mediaUrl" class="mt-1 text-primary-600">
                        <PaperClipIcon class="inline-block h-4 w-4 mr-1" /> Lampiran
                      </span>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span :class="[
                      message.status === 'pending' ? 'bg-yellow-50 text-yellow-800' :
                      message.status === 'sent' ? 'bg-blue-50 text-blue-800' :
                      message.status === 'delivered' ? 'bg-green-50 text-green-800' :
                      'bg-primary-50 text-primary-800',
                      'inline-flex rounded-full px-2 text-xs font-semibold leading-5'
                    ]">
                      {{ 
                        message.status === 'pending' ? 'Menunggu' :
                        message.status === 'sent' ? 'Terkirim' :
                        message.status === 'delivered' ? 'Diterima' :
                        'Dibaca'
                      }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ formatTime(message.time) }}</td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button
                      @click="resendMessage(message)"
                      v-if="message.status === 'pending'"
                      class="text-primary-600 hover:text-primary-900"
                    >
                      Kirim Ulang
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { UserCircleIcon, PaperClipIcon } from '@heroicons/vue/24/outline'

const messages = ref([
  {
    id: 1,
    customer: 'John Doe',
    phone: '+62812345678',
    content: 'Terima kasih telah menghubungi kami. Kami akan segera membantu Anda.',
    status: 'delivered',
    time: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    mediaUrl: null
  },
  {
    id: 2,
    customer: 'Jane Smith',
    phone: '+62876543210',
    content: 'Berikut katalog produk kami.',
    status: 'read',
    time: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    mediaUrl: 'https://example.com/catalog.pdf'
  },
  // Add more sample messages here
])

const searchQuery = ref('')
const filterStatus = ref('')

const filteredMessages = computed(() => {
  return messages.value
    .filter(message => {
      const matchesSearch = message.content.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        message.customer.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesStatus = !filterStatus.value || message.status === filterStatus.value
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => b.time - a.time)
})

const formatTime = (time) => {
  const now = new Date()
  const diff = now - time
  const minutes = Math.floor(diff / 1000 / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days} hari yang lalu`
  if (hours > 0) return `${hours} jam yang lalu`
  if (minutes > 0) return `${minutes} menit yang lalu`
  return 'Baru saja'
}

const resendMessage = async (message) => {
  try {
    // TODO: Implement resend message logic with API
    const response = await fetch(`/api/messages/${message.id}/resend`, {
      method: 'POST',
    })

    if (!response.ok) {
      throw new Error('Failed to resend message')
    }

    message.status = 'sent'
  } catch (error) {
    console.error('Resend error:', error)
    // TODO: Show error message to user
  }
}
</script>