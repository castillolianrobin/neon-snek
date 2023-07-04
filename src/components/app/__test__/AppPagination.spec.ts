import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import AppPagination from '../AppPagination.vue';
const name = 'AppPagination';


describe(name, ()=>{

  /** Previous Button Test */
  describe('Previous Button', ()=>{
    const length = 10;
    const modelValue = 6;
    const wrapperPrevious = mount(AppPagination, {
      props: { 
        length, 
        modelValue,
        'onUpdate:modelValue': (e: number) => { wrapperPrevious.setProps({ modelValue: e }) } 
      },
    });
    const pagesBtn = wrapperPrevious.findAll('button');
    const navBtn = pagesBtn[1];

    it('button is displayed correctly', ()=>{
      expect(navBtn.attributes('aria-label'))
        .toBe('previous button');
    })

    it('navigate on previous page when clicked', async ()=>{
      await navBtn.trigger('click')
      const currentModelValue = wrapperPrevious.props('modelValue');
      expect(currentModelValue).toBe(modelValue -1);
    })

    it('disable button when on first page', async ()=>{
      await wrapperPrevious.setProps({ modelValue: 1 });
      expect(navBtn.attributes()).toHaveProperty('disabled');
    });
  });

  /** Next Button Test */
  describe('Next Button', ()=>{
    const length = 10;
    const modelValue = 6;
    const pageVisible = 5;
    const wrapperPrevious = mount(AppPagination, {
      props: { 
        length, 
        modelValue,
        pageVisible,
        'onUpdate:modelValue': (e: any) => { wrapperPrevious.setProps({ modelValue: e }) } 
      },
    });
    const pagesBtn = wrapperPrevious.findAll('button');
    const navBtn = pagesBtn[pagesBtn.length-2];
    it('button is displayed correctly', ()=>{
      expect(navBtn.attributes('aria-label'))
        .toBe('next button');
    })

    it('navigate on next page when clicked', async ()=>{
      await navBtn.trigger('click')
      const currentModelValue = wrapperPrevious.props('modelValue');
      expect(currentModelValue).toBe(modelValue +1);
    })

    it('disable button when on last page', async ()=>{
      await wrapperPrevious.setProps({ modelValue: length});
      expect(navBtn.attributes()).toHaveProperty('disabled');
    });
  });

  /** First Page Button Test */
  describe('First Page Button Button', ()=>{
    const length = 10;
    const modelValue = 6;
    const pageVisible = 5;
    const wrapperPrevious = mount(AppPagination, {
      props: { 
        length, 
        modelValue,
        pageVisible,
        'onUpdate:modelValue': (e: any) => { wrapperPrevious.setProps({ modelValue: e }) }
      },
    });
    const pagesBtn = wrapperPrevious.findAll('button');
    const navBtn = pagesBtn[0];
    it('button is displayed correctly', ()=>{
      expect(navBtn.attributes('aria-label'))
        .toBe('jump to first page button');
    })

    it('navigate on first page when clicked', async ()=>{
      await navBtn.trigger('click')
      const currentModelValue = wrapperPrevious.props('modelValue');
      expect(currentModelValue).toBe(1);
    })

    it('disable button when on first page', async ()=>{
      await wrapperPrevious.setProps({ modelValue: 1});
      expect(navBtn.attributes()).toHaveProperty('disabled');
    });
  });

  /** Last Page Button Test */
  describe('Last Page Button Button', ()=>{
    const length = 10;
    const modelValue = 6;
    const pageVisible = 5;
    const wrapperPrevious = mount(AppPagination, {
      props: { 
        length, 
        modelValue,
        pageVisible,
        'onUpdate:modelValue': (e: any) => { wrapperPrevious.setProps({ modelValue: e }) }
      },
    });
    const pagesBtn = wrapperPrevious.findAll('button');
    const navBtn = pagesBtn[pagesBtn.length - 1];
    it('button is displayed correctly', ()=>{
      expect(navBtn.attributes('aria-label'))
        .toBe('jump to last page button');
    })

    it('navigate on last page when clicked', async ()=>{
      await navBtn.trigger('click')
      const currentModelValue = wrapperPrevious.props('modelValue');
      expect(currentModelValue).toBe(length);
    })

    it('disable button when on first page', async ()=>{
      await wrapperPrevious.setProps({ modelValue: length});
      expect(navBtn.attributes()).toHaveProperty('disabled');
    });
  });

  describe('Pages Button', ()=> {
    const length = 10;
    const initialValue = 5;
    const pageVisible = 3;
    const pageWrapper = mount(AppPagination, {
      props: { 
        length,
        pageVisible, 
        modelValue: initialValue,
        'onUpdate:modelValue': (e: any) => { pageWrapper.setProps({ modelValue: e }) } 
      },
    })

    const pageBtn = pageWrapper.findAll('button[aria-label^="page"]')
    const currentPageBtn = pageBtn.find(btn=>btn.classes().includes('scale-105'))
    
    it('displays the correct number of pages', async () => {
      // should be 
      expect(pageBtn.length).toBe(pageVisible);
      const jumpToLastBtn = pageWrapper.find('button[aria-label="jump to last page button"]')
      await jumpToLastBtn.trigger('click');
      const newPageBtn = pageWrapper.findAll('button[aria-label^="page"]')
      // should be 
      expect(newPageBtn.pop()?.text()).toBe(`${length}`)
    })

    it('displays the current page button correctly', ()=> {
      expect(currentPageBtn).not.toBe(undefined);
    })

    it('should not update when clicking the same page', async()=> {
      const beforeEmitAmount = pageWrapper.emitted('update:modelValue')?.length;
      await currentPageBtn?.trigger('click');
      await pageWrapper.vm.$nextTick();
      const afterEmitAmount = pageWrapper.emitted('update:modelValue')?.length;
      
      expect(beforeEmitAmount).not.toBe(afterEmitAmount);
    })

    it('should update when clicking another page', async ()=>{
      const newPage = initialValue + 1;
      const newPageBtn = pageWrapper
        .find(`button[aria-label="page ${newPage} button"]`);
      
      await newPageBtn.trigger('click');
      await pageWrapper.vm.$nextTick()

      expect(pageWrapper.props('modelValue')).toBe(newPage);
    })

    it('should not exceed the page length', async ()=> {
      const newLength = initialValue - 1;
      // Should not exced the length prop
      await pageWrapper.setProps({ length: newLength })
      expect(pageWrapper.props('modelValue')).toBe(newLength);

      // Should not exced the first length
      await pageWrapper.setProps({ modelValue: -1 })
      expect(pageWrapper.props('modelValue')).toBe(1);
      
      // Should not exced the last page
      await pageWrapper.setProps({ modelValue: 9999 })
      expect(pageWrapper.props('modelValue')).toBe(newLength);

    })

    it('should persist first and last page if persistEdgePage is true', async ()=>{
      await pageWrapper.setProps({ 
        persistEdgePages: true,
        length,
        modelValue: 5,
      });
      
      const firstPageBtn = pageWrapper.find('[aria-label="page 1 button"]');
      expect(firstPageBtn.exists()).toBeTruthy();
      
      const lastPageBtn = pageWrapper.find(`[aria-label="page ${length} button"]`);
      expect(lastPageBtn.exists()).toBeTruthy();
    })
  });

  describe('Pagination Details', ()=> {
    it('Show details on paginationDetails prop')
    it('Show correct results based on pagination')
  });
})