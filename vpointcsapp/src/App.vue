<template>
    <div class="min-h-full bg-dark-200 text-white">
        <nav class="bg-dark-100 border-b border-dark-300">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-16 items-center justify-between">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <h1 class="text-primary-400 font-bold text-xl">VPoint CS</h1>
                        </div>
                        <div class="hidden md:block">
                            <div class="ml-10 flex items-baseline space-x-4">
                                <router-link v-for="item in navigation" :key="item.name" :to="item.href"
                                    :class="[item.current ? 'bg-dark-300 text-primary-400' : 'text-gray-300 hover:bg-dark-300 hover:text-primary-300', 'rounded-md px-3 py-2 text-sm font-medium']">{{
                                    item.name }}</router-link>
                            </div>
                        </div>
                    </div>
                    <div class="hidden md:block">
                        <div class="ml-4 flex items-center md:ml-6">
                            <button type="button"
                                class="relative rounded-full bg-dark-300 p-1 text-gray-300 hover:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-dark-100">
                                <span class="absolute -inset-1.5"></span>
                                <span class="sr-only">View notifications</span>
                                <BellIcon class="h-6 w-6" aria-hidden="true" />
                            </button>

                            <!-- Profile dropdown -->
                            <Menu as="div" class="relative ml-3">
                                <div>
                                    <MenuButton
                                        class="relative flex max-w-xs items-center rounded-full bg-primary-600 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600">
                                        <span class="absolute -inset-1.5"></span>
                                        <span class="sr-only">Open user menu</span>
                                        <UserCircleIcon class="h-8 w-8 text-primary-200" aria-hidden="true" />
                                    </MenuButton>
                                </div>
                                <transition enter-active-class="transition ease-out duration-100"
                                    enter-from-class="transform opacity-0 scale-95"
                                    enter-to-class="transform opacity-100 scale-100"
                                    leave-active-class="transition ease-in duration-75"
                                    leave-from-class="transform opacity-100 scale-100"
                                    leave-to-class="transform opacity-0 scale-95">
                                    <MenuItems
                                        class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-dark-100 py-1 shadow-lg ring-1 ring-dark-300 focus:outline-none">
                                        <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                                        <a :href="item.href"
                                            :class="[active ? 'bg-dark-300 text-primary-400' : 'text-gray-300', 'block px-4 py-2 text-sm hover:bg-dark-300 hover:text-primary-300']">{{
                                            item.name }}</a>
                                        </MenuItem>
                                    </MenuItems>
                                </transition>
                            </Menu>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <main>
            <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                <router-view></router-view>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { BellIcon, UserCircleIcon } from '@heroicons/vue'

const navigation = ref([
    { name: 'Dashboard', href: '/', current: true },
    { name: 'Pesan Masuk', href: '/incoming', current: false },
    { name: 'Pesan Keluar', href: '/outgoing', current: false },
    { name: 'Pelanggan', href: '/customers', current: false },
    { name: 'Pengaturan', href: '/settings', current: false },
])

const userNavigation = ref([
    { name: 'Profil Saya', href: '#' },
    { name: 'Pengaturan', href: '#' },
    { name: 'Keluar', href: '#' },
])
</script>