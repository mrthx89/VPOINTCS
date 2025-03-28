<template>
  <div>
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900">Pesan Masuk</h1>
        <p class="mt-2 text-sm text-gray-700">Daftar semua pesan WhatsApp yang masuk dari pelanggan.</p>
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
            <option value="unread">Belum Dibaca</option>
            <option value="read">Sudah Dibaca</option>
            <option value="replied">Sudah Dibalas</option>
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
                <tr v-for="message in filteredMessages" :key="message.id" :class="{ 'bg-primary-50': message.status === 'unread' }">
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
                      message.status === 'unread' ? 'bg-yellow-50 text-yellow-800' :
                      message.status === 'read' ? 'bg-blue-50 text-blue-800' :
                      'bg-green-50 text-green-800',
                      'inline-flex rounded-full px-2 text-xs font-semibold leading-5'
                    ]">
                      {{ 
                        message.status === 'unread' ? 'Belum Dibaca' :
                        message.status === 'read' ? 'Sudah Dibaca' :
                        'Sudah Dibalas'
                      }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ formatTime(message.time) }}</td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button
                      @click="replyMessage(message)"
                      class="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      Balas
                    </button>
                    <button
                      @click="markAsRead(message)"
                      v-if="message.status === 'unread'"
                      class="text-primary-600 hover:text-primary-900"
                    >
                      Tandai Dibaca
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Reply Modal -->
    <TransitionRoot as="template" :show="isReplyModalOpen">
      <Dialog as="div" class="relative z-10" @close="closeReplyModal">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div class="mt-3 text-center sm:mt-5">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                      Balas Pesan
                    </DialogTitle>
                    <div class="mt-2">
                      <textarea
                        rows="4"
                        v-model="replyContent"
                        class="input-field"
                        placeholder="Ketik pesan balasan..."
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    class="btn-primary"
                    @click="sendReply"
                  >
                    Kirim
                  </button>
                  <button
                    type="button"
                    class="btn-secondary mt-3 sm:mt-0"
                    @click="closeReplyModal"
                  >
                    Batal
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { UserCircleIcon, PaperClipIcon } from '@heroicons/vue/24/outline'

const messages = ref([
  {
    id: 1,
    customer: 'John Doe',
    phone: '+62812345678',
    content: 'Halo, saya ingin bertanya tentang produk...',
    status: 'unread',
    time: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    mediaUrl: null
  },
  {
    id: 2,
    customer: 'Jane Smith',
    phone: '+62876543210',
    content: 'Terima kasih atas bantuannya',
    status: 'replied',
    time: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    mediaUrl: 'https://example.com/image.jpg'
  },
  // Add more sample messages here
])

const searchQuery = ref('')
const filterStatus = ref('')
const isReplyModalOpen = ref(false)
const replyContent = ref('')
const selectedMessage = ref(null)

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

const replyMessage = (message) => {
  selectedMessage.value = message
  replyContent.value = ''
  isReplyModalOpen.value = true
}

const closeReplyModal = () => {
  isReplyModalOpen.value = false
  selectedMessage.value = null
}

const sendReply = async () => {
  if (!replyContent.value.trim()) return

  try {
    // TODO: Implement send reply logic with API
    const response = await fetch('/api/messages/reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messageId: selectedMessage.value.id,
        content: replyContent.value,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to send reply')
    }

    // Update message status
    selectedMessage.value.status = 'replied'
    closeReplyModal()
  } catch (error) {
    console.error('Reply error:', error)
    // TODO: Show error message to user
  }
}

const markAsRead = async (message) => {
  try {
    // TODO: Implement mark as read logic with API
    const response = await fetch(`/api/messages/${message.id}/read`, {
      method: 'PUT',
    })

    if (!response.ok) {
      throw new Error('Failed to mark message as read')
    }

    message.status = 'read'
  } catch (error) {
    console.error('Mark as read error:', error)
    // TODO: Show error message to user
  }
}
</script>