import { defaultSlotTest, namedSlotTest } from '@/components/__tests__/helpers/slot.spec';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { AppDropdown } from '../';
const name = 'AppDropdown';

describe(name, ()=>{
  describe('Trigger', ()=>{
    // Slot test
    namedSlotTest(AppDropdown, 'trigger')
    
    const wrapper = mount(AppDropdown, {
      slots: {
        default(_) {},
        trigger: `
          <template #trigger="{ props }">
            <button id="trigger" v-bind="{ ...props }">
              Trigger
            </button>
          </template>
        `,
      }
    });
    const TriggerButton = wrapper.find('#trigger');
    const getDropdownMenu = () => wrapper.find('[role="listbox"]');
    it('show the menu on trigger click', async ()=> {
      await TriggerButton.trigger('click');
      expect(getDropdownMenu().exists()).toBe(true);
    })
    
    it('hide the menu on trigger click', async ()=>{
      await TriggerButton.trigger('click');
      expect(getDropdownMenu().exists()).toBe(false);
    })
  });
  describe('Dropdown', ()=>{
    const wrapper = mount(AppDropdown);
    const trigger = wrapper.find('[aria-label="dropdown button"]');
    it('should show on trigger', async ()=>{
      await trigger.trigger('click');
      const menu = wrapper.find('[role="listbox"]');
      expect(menu.exists()).toBeTruthy();
    })

    it('should show the right content if items prop has value', async ()=>{
      const items = [
        { text: 'Item Test', onClick() { console.log('test') } }
      ];

      await wrapper.setProps({ items });
      const items1 = wrapper
        .findAll(`li`)
        // .filter(item=>item.text() === items[0].text);

      expect(items1.length).toBeGreaterThan(0);
    })

    it('should hide if click outside', async ()=> {
      await trigger.trigger('click');
      const menu = wrapper.find('[role="listbox"]');
      expect(menu.exists()).not.toBeTruthy();
    })

    it('should retain content if eager props is true', async ()=> {
      await wrapper.setProps({ eager: true });
      const menu = wrapper.find('[role="listbox"]');
      expect(menu.exists()).toBeTruthy();
      expect(menu.isVisible()).not.toBeTruthy();
    })
    
    // Slot Test
    defaultSlotTest(AppDropdown, {}, {
      async afterMount(wrapper) { 
        const trigger = wrapper.find('[aria-label="dropdown button"]');
        await trigger.trigger('click'); 
      },
    })



  });
})