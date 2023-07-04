<script setup lang="ts">
import { computed, ref, toRef, type PropType } from 'vue';
import { AppButton } from '.';
import type { VariantProp } from './AppButton.vue';
import { createThemedColor, themedColorProps } from '@/composables';

export type DropProp = 'down'|'up'|'left'|'right';
export interface ItemProp { text: string; onClick?: ()=>void; }
const props = defineProps({
  ...themedColorProps,
  drop: { 
    type: String as PropType<DropProp>, 
    default: 'down', 
    required: false 
  },
  items: { 
    type: Array as PropType<ItemProp[]>,
    default: ()=>[], 
    required: false,
  },
  eager: {
    type: Boolean as PropType<boolean>,
    default: false,
    required: false,
  },
  triggerVariant: { type: String as PropType<VariantProp>, default: 'solid', required: false },
  triggerText: String,
});

const emits = defineEmits(['itemClick'])

/** Themed color composables */
const { color } = createThemedColor(toRef(props, 'color'))




/** Dropdown Logic */
const isActive = ref(false);

function toggleMenu(active?:boolean) {
  isActive.value = typeof active === 'boolean' 
    ? active
    : !isActive.value;
}

function onDropdownItemClickHandler(item: ItemProp) {
  item?.onClick && item.onClick();
  emits('itemClick', item.text);
  toggleMenu(false);
}

/** Trigger attributes and event */
const triggerAttrs = computed(()=>({
  // OnClick Event
  onclick: toggleMenu,
  // Aria Attrs
  role: 'button',
  'aria-label': 'dropdown button',
  'aria-haspopup': true,
  'aria-expanded': isActive.value,
}));


/** Menu Classes */
const positionClass = computed(()=>{
  switch (props.drop) {
    case 'up': return 'bottom-full right-0'
    case 'left': return 'top-0 right-full'
    case 'right': return 'top-0 left-full'
    case 'down':default: return 'top-full left-0 right-0';
  }
});

</script>

<template>
  <div 
    class="relative inline-block"
    v-on-click-outside="()=>toggleMenu(false)"
  >
    <!-- Trigger -->
    <slot 
      name="trigger" 
      v-bind="{ props:triggerAttrs, toggleMenu }"
    >
      <AppButton
        :variant="props.triggerVariant"
        v-bind="{ ...triggerAttrs }"
      >
        <span v-if="triggerText">
          {{  triggerText  }}
        </span>
        <span v-else>
          {{  isActive ? 'Hide' : 'Show'  }} Dropdown
        </span>
      </AppButton>
    </slot>

    <!-- Menu -->
    <Transition
      enter-active-class="duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100"
      leave-active-class="duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div 
        v-if="isActive || props.eager"
        v-show="isActive"
        :class="[ 
          'absolute min-w-full w-fit z-20', 
          positionClass 
        ]"
      >
        <slot>
          <ul 
            class="
              bg-white 
              dark:bg-secondary-900 
              dark:text-secondary-100
              rounded 
              shadow-lg
            "
            role="listbox"

          >
            <li
              v-for="item, i in props.items"
              :key="`${item.text}-${i}`"
              :class="[
                `
                  px-2 py-1 
                  cursor-pointer
                  overflow-auto 
                  whitespace-nowrap
                  hover:text-white
                  active:brightness-75
                `,
                `hover:bg-${color}`
              ]"
              tabindex="0"
              @click="onDropdownItemClickHandler(item)"
              @keydown.space.enter="onDropdownItemClickHandler(item)"
            >
              {{ item.text }}
            </li>
          </ul>
        </slot>
      </div>
    </Transition>
  </div>
</template>

