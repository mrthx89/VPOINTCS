<template>
    <div>
        <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
                <h1 class="text-base font-semibold leading-6 text-gray-900">Pelanggan</h1>
                <p class="mt-2 text-sm text-gray-700">Daftar semua pelanggan yang terdaftar di sistem.</p>
            </div>
            <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <div class="flex space-x-4">
                    <div class="relative">
                        <input type="text" v-model="searchQuery" placeholder="Cari pelanggan..."
                            class="input-field w-64" />
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-8 flow-root">
            <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                        <table class="min-w-full divide-y divide-gray-300">
                            <thead class="bg-dark-300">
                                <tr>
                                    <th scope="col"
                                        class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">Nama
                                    </th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">No.
                                        WhatsApp</th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">Pesan
                                        Terakhir</th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">
                                        Status</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-dark-300 bg-dark-100">
                                <tr v-for="customer in filteredCustomers" :key="customer.id">
                                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                        <div class="flex items-center">
                                            <div class="h-10 w-10 flex-shrink-0">
                                                <UserCircleIcon class="h-10 w-10 text-gray-500" aria-hidden="true" />
                                            </div>
                                            <div class="ml-4">
                                                <div class="font-medium text-gray-200">{{ customer.name }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{{ customer.phone }}
                                    </td>
                                    <td class="px-3 py-4 text-sm text-gray-300">
                                        <div class="max-w-md">
                                            <p class="truncate">{{ customer.lastMessage }}</p>
                                            <p class="text-xs text-gray-500">{{ formatTime(customer.lastMessageTime) }}
                                            </p>
                                        </div>
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                                        <span :class="[
                            customer.isActive ? 'bg-primary-900/30 text-primary-300' : 'bg-dark-300 text-gray-400',
                            'inline-flex rounded-full px-2 text-xs font-semibold leading-5'
                        ]">
                                            {{ customer.isActive ? 'Aktif' : 'Tidak Aktif' }}
                                        </span>
                                    </td>
                                    <td
                                        class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <button @click="viewCustomerDetails(customer)"
                                            class="text-primary-400 hover:text-primary-300 mr-4">
                                            Detail
                                        </button>
                                        <button @click="sendMessage(customer)"
                                            class="text-primary-400 hover:text-primary-300">
                                            Kirim Pesan
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Send Message Modal -->
        <TransitionRoot as="template" :show="isMessageModalOpen">
            <Dialog as="div" class="relative z-10" @close="closeMessageModal">
                <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0"
                    enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </TransitionChild>

                <div class="fixed inset-0 z-10 overflow-y-auto">
                    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <TransitionChild as="template" enter="ease-out duration-300"
                            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
                            leave-from="opacity-100 translate-y-0 sm:scale-100"
                            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                            <DialogPanel
                                class="relative transform overflow-hidden rounded-lg bg-dark-100 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 border border-dark-300">
                                <div>
                                    <div class="mt-3 text-center sm:mt-5">
                                        <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-200">
                                            Kirim Pesan ke {{ selectedCustomer?.name }}
                                        </DialogTitle>
                                        <div class="mt-2">
                                            <textarea rows="4" v-model="messageContent"
                                                class="block w-full rounded-md border-0 py-1.5 bg-dark-300 text-white shadow-sm ring-1 ring-inset ring-dark-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
                                                placeholder="Ketik pesan..."></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                    <button type="button"
                                        class="flex w-full justify-center rounded-md bg-primary-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                                        @click="sendMessageToCustomer">
                                        Kirim
                                    </button>
                                    <button type="button"
                                        class="flex w-full justify-center rounded-md bg-dark-300 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-300 shadow-sm hover:bg-dark-400 hover:text-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-300 mt-3 sm:mt-0"
                                        @click="closeMessageModal">
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
import { UserCircleIcon } from '@heroicons/vue/24/outline'

const customers = ref([
    {
        id: 1,
        name: 'John Doe',
        phone: '+62812345678',
        lastMessage: 'Terima kasih atas bantuannya',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        isActive: true
    },
    {
        id: 2,
        name: 'Jane Smith',
        phone: '+62876543210',
        lastMessage: 'Baik, saya akan menunggu informasi selanjutnya',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        isActive: false
    },
    // Add more sample customers here
])

const searchQuery = ref('')
const isMessageModalOpen = ref(false)
const messageContent = ref('')
const selectedCustomer = ref(null)

const filteredCustomers = computed(() => {
    return customers.value
        .filter(customer => {
            const searchLower = searchQuery.value.toLowerCase()
            return customer.name.toLowerCase().includes(searchLower) ||
                customer.phone.includes(searchLower)
        })
        .sort((a, b) => b.lastMessageTime - a.lastMessageTime)
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

const viewCustomerDetails = (customer) => {
    // TODO: Implement customer details view
    console.log('View customer details:', customer)
}

const sendMessage = (customer) => {
    selectedCustomer.value = customer
    messageContent.value = ''
    isMessageModalOpen.value = true
}

const closeMessageModal = () => {
    isMessageModalOpen.value = false
    selectedCustomer.value = null
}

const sendMessageToCustomer = async () => {
    if (!messageContent.value.trim()) return

    try {
        // TODO: Implement send message logic with API
        const response = await fetch('/api/messages/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                customerId: selectedCustomer.value.id,
                content: messageContent.value,
            }),
        })

        if (!response.ok) {
            throw new Error('Failed to send message')
        }

        closeMessageModal()
    } catch (error) {
        console.error('Send message error:', error)
        // TODO: Show error message to user
    }
}
</script>