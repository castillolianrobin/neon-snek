<script setup lang="ts">
// Vue  
import { defineAsyncComponent, ref, type FunctionalComponent, type HTMLAttributes, type VNodeProps } from 'vue';
// Components
import { AppButton } from '@/components/app';
// icons
import {  Bars3Icon as HamburgerIcon } from '@heroicons/vue/24/solid'
// Extra
import dashboardRoutes from '@/modules/Dashboard/dashboard.routes';
import userRoutes from '@/modules/User/user.routes';
import ordersRoutes from '@/modules/Orders/orders.routes';
import postRoutes from '@/modules/Posts/post.routes';
import {
  default as LayoutDashboardSideBarItem,
  type NavigationItem
} from './LayoutDashboardSideBarItem.vue';
import productRoutes from '@/modules/Product/product.routes';

const active = ref(false);


const mapRouteToSidebar:<T extends Navigation>(nav:T)=>Navigation = ({ name, label, icon, children, hidden, ...rest })=>({
  name: name, 
  label,
  icon: icon ? defineAsyncComponent(icon) : icon,
  children: children ? children.map(mapRouteToSidebar) : undefined,
  hidden, 
  ...rest
});

const navigations: Navigation[] = [
  ...dashboardRoutes,
  ...productRoutes,
  ...ordersRoutes,
  ...userRoutes,
  ...postRoutes,
  // Map to Component
  {
    name: 'ComponentHome',
    label: 'Go to Component List',
    icon: () => import('@heroicons/vue/24/solid/GlobeAltIcon'),
    class: 'text-secondary-500'
  }
].map(mapRouteToSidebar);


interface Navigation extends NavigationItem {
  class?: string;
}

</script>

<template>
  <div
    class="
      pt-3
      flex flex-col
      relative
      h-full
      bg-secondary-900 dark:bg-secondary-800 
      text-secondary-200
      shadow-xl
      z-20
    "
  >
    
    <!-- User Name -->
    <div 
      class="mx-1 px-2 py-1 max-w-[240px] hidden md:block border border-secondary-500 select-none"
    >
      <p class="w-[93%] truncate text-center uppercase text-sm text-secondary-500">
        Lian Robin Casillo 
      </p>
    </div>

    <!-- Hamburger Icon -->
    <div 
      class="ml-auto flex-shrink-0 z-20 shadow-md md:invisible"
    >
      <AppButton 
        variant="text"
        size="sm"
        class="px-0"
        color="white"
        @click="active = !active"
      >
        <HamburgerIcon class="h-6">
        </HamburgerIcon>
      </AppButton>
    </div>

    <aside 
        class="
          pl-1
          transition-all
          md:w-screen max-w-[250px] h-full 
          overflow-auto
          absolute md:relative top-[41px] md:top-0  
          bg-inherit
        "
        :class="{
          'w-[30px]': !active,
          'w-screen': active,
        }"
      >
        <ul 
          class=""
        >
          <LayoutDashboardSideBarItem
            v-for="{ 
              label, name, icon, children, ...rest 
            } in navigations"
            :key="label"
            :hide-label="!active"
            class="my-4 border-l-4 border-primary-500/0"
            :class="rest.class"
            v-bind="{ label, name, icon, children }"
            @click="active = false"
          ></LayoutDashboardSideBarItem>
        </ul>
    </aside>
  </div>
</template>
