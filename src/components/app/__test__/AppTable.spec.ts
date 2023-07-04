
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { AppTable } from '../';
import type { HeadersProp } from "../AppTable.vue";
const name = 'AppTable';

describe(name, ()=>{
  /** HEADERS */
  describe('Header', ()=>{
    it ('displays array of string headers', ()=> {
      const headers = ['Header 1', 'Header 2', 'Header 3'];
      const wrapper = mount(AppTable, {
        props: {
          headers,
          items: [],
        }
      });
      const headerCells = wrapper.findAll('th');
      expect(headerCells.length).toBe(headers.length);
      expect(headerCells[0].text()).toBe(headers[0]);
    })

    it ('displays array of object headers', ()=> {
      const headers: HeadersProp[] = [
        { text: 'Header 1', key: 'header_1' },
        { text: 'Header 2', key: 'header_2' },
        { text: 'Header 3', key: 'header_3' },
      ];
      const wrapper = mount(AppTable, {
        props: {
          headers,
          items: [],
        }
      });
      const headerCells = wrapper.findAll('th');
      expect(headerCells.length).toBe(headers.length);
      expect(headerCells[0].text()).toBe(headers[0].text);
    })

    
    it ('emit update:headers on sort click', async ()=> {
      let headers: HeadersProp[] = [
        { text: 'Header 1', key: 'header_1', sortable: true },
        { text: 'Header 2', key: 'header_2' },
        { text: 'Header 3', key: 'header_3'},
      ];

      const wrapper = mount(AppTable, {
        props: {
          headers,
          items: [],
          'onUpdate:headers': (e:HeadersProp[]) => headers = e, 
        }
      });
      const sortByFirstColumn = wrapper
        .find(`.header-${headers[0].key}-sort-btn`)

      expect(sortByFirstColumn.exists()).toBe(true);
      
      await sortByFirstColumn.trigger('click');
      await wrapper.vm.$nextTick();

      expect(headers[0].desc).toBe(true);
    })

    it ('emit sort event with header value on sort click', async ()=> {
      const headers: HeadersProp[] = [
        { text: 'Header 1', key: 'header_1', sortable: true },
        { text: 'Header 2', key: 'header_2' },
        { text: 'Header 3', key: 'header_3'},
      ];
      let items  = [
        { header_1: 'D', header_2: '2', headers_3: '@' },
      ];
      let newHeaderData: HeadersProp = { text: '', key: '' };
      const wrapper = mount(AppTable, {
        props: {
          headers,
          items,
          'onSort': (e: { items: any; header: HeadersProp }) => {
              items = e?.items;
              newHeaderData = e.header
          },  
        }
      });
      const sortByFirstColumn = wrapper
        .find(`.header-${headers[0].key}-sort-btn`)

      expect(sortByFirstColumn.exists()).toBe(true);
      
      await sortByFirstColumn.trigger('click');
      await wrapper.vm.$nextTick();
      
      expect(newHeaderData.desc).toBe(true);
      expect(newHeaderData.key).toBe('header_1');
    })
 
    // it should be able to modify header content by column via slot
    
    // SLOTS

  });


  /** ITEMS */
  describe('Items', ()=> {
    it('display items according to headers(array of strings)', ()=> {
      const headers = ['Header 1', 'Header 2', 'Header 3'];
      const items = [
        { 0: 'Content 1', 1: 'Content 2', 2: 'content 3' },
      ];
      const wrapper = mount(AppTable, { 
        props: { headers, items }
      });
      const item_1 = wrapper.find(`.item-${0}-${0}`);
      const item_2 = wrapper.find(`.item-${0}-${1}`);
      const item_3 = wrapper.find(`.item-${0}-${2}`);
      
      expect(item_1.text()).toBe(items[0][0]);
      expect(item_2.text()).toBe(items[0][1]);
      expect(item_3.text()).toBe(items[0][2]);
    })

    it('display items according to headers(array of objects)', ()=> {
      const headers: HeadersProp[] = [
        { text: 'Header 1', key: 'header_1' },
        { text: 'Header 2', key: 'header_2' },
        { text: 'Header 3', key: 'header_3'},
        { text: 'Header 4', key: 'header_4', subKey: 'subType1'},
      ];
      const items: Record<string, any>[]  = [
        { 
          header_1: 'content 1', 
          header_2: 'content 2', 
          header_3: 'content 3', 
          header_4: { subType1: 'Test Subtype' }, 
        },
      ];
      const wrapper = mount(AppTable, { 
        props: { headers, items }
      });
      const item_1 = wrapper.find(`.item-${0}-${headers[0].key}`);
      const item_2 = wrapper.find(`.item-${0}-${headers[1].key}`);
      const item_3 = wrapper.find(`.item-${0}-${headers[2].key}`);
      // With subkey
      const item_4 = wrapper.find(`.item-${0}-${headers[3].key}-${headers[3].subKey}`);

      expect(item_1.text()).toBe(items[0][headers[0].key]);
      expect(item_2.text()).toBe(items[0][headers[1].key]);
      expect(item_3.text()).toBe(items[0][headers[2].key]);
      if (headers[3].subKey) {
        expect(item_4.text()).toBe(items[0][headers[3].key]?.[headers[3].subKey]);
      }
    })


    it('display the number of item based on itemsPerPage props', ()=> {
      const headers = ['Header 1', 'Header 2', 'Header 3'];
      const items = [
        { 0: 'Content 1', 1: 'Content 2', 2: 'content 3' },
        { 0: 'Content 1', 1: 'Content 2', 2: 'content 3' },
        { 0: 'Content 1', 1: 'Content 2', 2: 'content 3' },
        { 0: 'Content 1', 1: 'Content 2', 2: 'content 3' },
        { 0: 'Content 1', 1: 'Content 2', 2: 'content 3' },
        { 0: 'Content 1', 1: 'Content 2', 2: 'content 3' },
        { 0: 'Content 1', 1: 'Content 2', 2: 'content 3' },
        { 0: 'Content 1', 1: 'Content 2', 2: 'content 3' },
        { 0: 'Content 1', 1: 'Content 2', 2: 'content 3' },
        { 0: 'Content 1', 1: 'Content 2', 2: 'content 3' },
        { 0: 'Content 1', 1: 'Content 2', 2: 'content 3' },
        { 0: 'Content 1', 1: 'Content 2', 2: 'content 3' },
      ];
      const itemsPerPage = 5;
      const wrapper = mount(AppTable, { 
        props: { headers, items, itemsPerPage }
      });
      const displayedItems = wrapper
        .find('tbody').findAll('tr');

      expect(displayedItems.length).toBe(itemsPerPage)
    })

    it('sort items based on header data', async ()=> {
      const headers: HeadersProp[] = [
        { text: 'Header 1', key: 'header_1', sortable: true },
        { text: 'Header 2', key: 'header_2' },
        { text: 'Header 3', key: 'header_3'},
      ];

      const FIRST_SORTED_VAL = 'A'; 
      const LAST_SORTED_VAL = 'Z'; 
      const items  = [
        { header_1: 'D', header_2: '2', headers_3: '@' },
        { header_1: LAST_SORTED_VAL, header_2: '3', headers_3: '@' },
        { header_1: FIRST_SORTED_VAL, header_2: '1', headers_3: '@' },
        { header_1: 'C', header_2: '4', headers_3l: '@' },
        { header_1: 'G', header_2: '2', headers_3: '@' },
        { header_1: 'E', header_2: '2', headers_3: '@' },
      ];

      const wrapper = mount(AppTable, {
        props: {
          headers,
          items,
          itemsPerPage: items.length,
        }
      });
      const sortByFirstColumn = wrapper
        .find(`.header-${headers[0].key}-sort-btn`)

      expect(sortByFirstColumn.exists()).toBe(true);

      await sortByFirstColumn.trigger('click');
      await wrapper.vm.$nextTick();
      const newItems = wrapper
        .find('tbody')
        .findAll('tr')
        .map((tr, i)=>
          tr.find(`.item-${i}-${headers[0].key}`).text()
        );
      expect(newItems[0]).toBe(LAST_SORTED_VAL);
      expect(newItems[newItems.length-1]).toBe(FIRST_SORTED_VAL);
    })

    it('return the sorted items via sort emit', async ()=> {
      const headers: HeadersProp[] = [
        { text: 'Header 1', key: 'header_1', sortable: true },
        { text: 'Header 2', key: 'header_2' },
        { text: 'Header 3', key: 'header_3'},
      ];

      const FIRST_SORTED_VAL = 'A'; 
      const LAST_SORTED_VAL = 'Z'; 
      let items  = [
        { header_1: 'D', header_2: '2', headers_3: '@' },
        { header_1: LAST_SORTED_VAL, header_2: '3', headers_3: '@' },
        { header_1: FIRST_SORTED_VAL, header_2: '1', headers_3: '@' },
        { header_1: 'C', header_2: '4', headers_3l: '@' },
        { header_1: 'G', header_2: '2', headers_3: '@' },
        { header_1: 'E', header_2: '2', headers_3: '@' },
      ];

      const wrapper = mount(AppTable, {
        props: {
          headers,
          items,  
          'onSort': (e: { items: any; header: HeadersProp }) => {
              items = e?.items;
          },  
        }
      });
      const sortByFirstColumn = wrapper
        .find(`.header-${headers[0].key}-sort-btn`)

      expect(sortByFirstColumn.exists()).toBe(true);

      const previousItemLength = items.length;
      await sortByFirstColumn.trigger('click');
      await wrapper.vm.$nextTick();

      expect(items.length).toBe(previousItemLength);
      expect(items[0].header_1).toBe(LAST_SORTED_VAL);
      expect(items[items.length-1].header_1).toBe(FIRST_SORTED_VAL);
    })

    it('emit itemClick event if item-clickable is true', async ()=> {
      const headers = ['Header 1', 'Header 2', 'Header 3'];
      const items = [
        { 0: 'Content 1', 1: 'Content 2', 2: 'content 3' },
      ];
      const wrapper = mount(AppTable, {
        props: {
          headers,
          items,
          itemsClickable: true,
        }
      });
      const firstItem = wrapper
        .find('tbody').find('tr');
      
      await firstItem.trigger('click');
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('itemClick')?.length).toBeGreaterThanOrEqual(1)
    })
    
    // IF API
    it('should not change items if static prop is enabled', async ()=> {
      const headers: HeadersProp[] = [
        { text: 'Header 1', key: 'header_1', sortable: true },
        { text: 'Header 2', key: 'header_2' },
        { text: 'Header 3', key: 'header_3'},
      ];

      const FIRST_SORTED_VAL = 'A'; 
      const LAST_SORTED_VAL = 'Z'; 
      const items  = [
        { header_1: 'D', header_2: '2', headers_3: '@' },
        { header_1: LAST_SORTED_VAL, header_2: '3', headers_3: '@' },
        { header_1: FIRST_SORTED_VAL, header_2: '1', headers_3: '@' },
        { header_1: 'C', header_2: '4', headers_3l: '@' },
        { header_1: 'G', header_2: '2', headers_3: '@' },
        { header_1: 'E', header_2: '2', headers_3: '@' },
      ];
      const itemsPerPage = 3;
      const currentPage = 2; 
      const wrapper = mount(AppTable, {
        props: {
          headers,
          items,
          itemsPerPage,
          currentPage,
          static: true,
        },
      });
      const sortByFirstColumn = wrapper
        .find(`.header-${headers[0].key}-sort-btn`)
      
      // first column should exist
      expect(sortByFirstColumn.exists()).toBe(true);

      await sortByFirstColumn.trigger('click');
      await wrapper.vm.$nextTick();

      const newItems = wrapper
        .find('tbody')
        .findAll('tr')
        .map((tr, i)=>
          tr.find(`.item-${i}-${headers[0].key}`).text()
        );
      // items per page should not work
      expect(newItems.length).not.toBe(itemsPerPage);
      // sorting should not work
      expect(newItems[0]).not.toBe(LAST_SORTED_VAL);
      expect(newItems[newItems.length-1]).not.toBe(FIRST_SORTED_VAL);
      // pagination should not work
      const firstItemIndex = (currentPage - 1) * itemsPerPage
      expect(items[firstItemIndex].header_1).not.toBe(newItems[0])
    })
    // it should be able to modify cell content by row via slot
    // it('')

    // SLOTS
  });

  /** PAGINATION */
  describe('Pagination', ()=> {
    const headers = ['Header 1', 'Header 2', 'Header 3'];
    const items = [
      { 0: 'Content 1', 1: 'Content 2', 2: 'content 3' },
      { 0: 'Content 2', 1: 'Content 2', 2: 'content 3' },
      { 0: 'Content 3', 1: 'Content 2', 2: 'content 3' },
      { 0: 'Content 4', 1: 'Content 2', 2: 'content 3' },
      { 0: 'Content 5', 1: 'Content 2', 2: 'content 3' },
      { 0: 'Content 6', 1: 'Content 2', 2: 'content 3' },
      { 0: 'Content 7', 1: 'Content 2', 2: 'content 3' },
      { 0: 'Content 8', 1: 'Content 2', 2: 'content 3' },
      { 0: 'Content 9', 1: 'Content 2', 2: 'content 3' },
      { 0: 'Content 10', 1: 'Content 2', 2: 'content 3' },
      { 0: 'Content 11', 1: 'Content 2', 2: 'content 3' },
      { 0: 'Content 12', 1: 'Content 2', 2: 'content 3' },
    ];
    const itemsPerPage = 5;
    const currentPage = 2;
    const wrapper = mount(AppTable, {
      props: { 
        items, 
        headers, 
        itemsPerPage,
        currentPage,
      }
    });

    /** Page Test Helpers */
    function getItemByPage(page: number) {
      const startIndex = +itemsPerPage * (page - 1); 
      const endIndex = +startIndex + (+itemsPerPage);
      return items.slice(startIndex, endIndex);
    }
    function getTableItems() {
      return wrapper.find('tbody').findAll(`tr`)
    }

    it('paginate based on given items', ()=> {
      const tableLastItemCol1 = getTableItems().map((item, i) =>
        item.find(`.item-${i}-${0}`).text()
      ).pop();
      const page1LastItem = getItemByPage(currentPage).pop();

      expect(tableLastItemCol1).toBe(page1LastItem?.[0])
    })

    it('displays current page correctly', ()=> {
      const pageBtn = wrapper.findAll('button[aria-label*="page"]')
      const currentPageBtn = pageBtn.find(btn=>btn.classes().includes('scale-105'))

      expect(currentPageBtn?.text()).toBe(`${currentPage}`);
    })
    
    it('change data based on page click event', async ()=>{
      const page3 = wrapper.find('button[aria-label="page 3 button"]');
      await page3.trigger('click');
      await wrapper.vm.$nextTick();
      const tableItemsCol1 = getTableItems()
        .map((item, i)=>
          item.find(`.item-${i}-${0}`).text()
        );
        
      // page 1 last item is correct
      const page3FirstItem =  getItemByPage(3)[0];
      expect(tableItemsCol1[0]).toBe(page3FirstItem[0])
      // page 2 last item is correct
      const page3LastItem =  getItemByPage(3).pop();
      expect(tableItemsCol1.pop()).toBe(page3LastItem?.[0])
    })

    it('change active page based on page click even', async ()=>{
      await wrapper.vm.$nextTick();
      const pageBtn = wrapper.findAll('button[aria-label*="page"]')
      const currentPageBtn = pageBtn.find(btn=>btn.classes().includes('scale-105'))
      
      expect(currentPageBtn?.text()).toBe(`${currentPage + 1}`)
    })

    it('emit update:currentPage event on click', ()=>{
      expect(wrapper.emitted('update:currentPage')?.length)
        .toBeGreaterThanOrEqual(1);
    })
    
    
    // IF STATIC

    const pageLength = 20;
    const staticCurrentPage = pageLength - 1;
    const staticWrapper = mount(AppTable, {
      props: { 
        headers, 
        items, 
        itemsPerPage, 
        currentPage: staticCurrentPage,
        pageLength,
        static: true, 
      },
    })
    
    // todo
    it('display pages based on pageLength prop if static', ()=> {
      const pageBtn = staticWrapper.findAll('button[aria-label^="page"]')
      const lastPageBtn = pageBtn.pop();
      expect(lastPageBtn?.text()).toBe(`${pageLength}`);
    })

    it('disable pagination if static', async ()=>{
      const pageBtn = staticWrapper.findAll('button[aria-label*="page"]')
      const lastPageBtn = pageBtn.pop();
      await lastPageBtn?.trigger('click');
      const currentPageBtn = pageBtn.find(btn=>btn.classes().includes('scale-105'))
      
      expect(currentPageBtn?.text()).toBe(`${staticCurrentPage}`);
    })
  });

  describe('loading', ()=> {
    const headers: HeadersProp[] = [
      { text: 'Header 1', key: 'header_1', sortable: true },
      { text: 'Header 2', key: 'header_2' },
      { text: 'Header 3', key: 'header_3'},
    ];
    const items = [
      { 0: 'Content 1', 1: 'Content 2', 2: 'content 3' },
      { 0: 'Content 1', 1: 'Content 2', 2: 'content 3' },
      { 0: 'Content 1', 1: 'Content 2', 2: 'content 3' },
      { 0: 'Content 1', 1: 'Content 2', 2: 'content 3' },
      { 0: 'Content 1', 1: 'Content 2', 2: 'content 3' },
      { 0: 'Content 1', 1: 'Content 2', 2: 'content 3' },
      { 0: 'Content 1', 1: 'Content 2', 2: 'content 3' },
      { 0: 'Content 1', 1: 'Content 2', 2: 'content 3' },
      { 0: 'Content 1', 1: 'Content 2', 2: 'content 3' },
      { 0: 'Content 1', 1: 'Content 2', 2: 'content 3' },
      { 0: 'Content 1', 1: 'Content 2', 2: 'content 3' },
      { 0: 'Content 1', 1: 'Content 2', 2: 'content 3' },
    ];

    
    const wrapper = mount(AppTable, {
      props: {  headers, items, loading: true }
    })
    it('show loading overlay on body when enabled', ()=> {
      const loadingOverlay = wrapper.find('[aria-label="loading spinner"]')
        // .find('div[role="alert"][aria-busy="true"]')

      expect(loadingOverlay.exists()).toBeTruthy();
    })

    it('disables button and sorting when loading', async ()=> {
      const paginationBtns = wrapper.findAll('button[aria-label^="page"]')
      await paginationBtns[1].trigger('click');
      expect(wrapper.emitted('update:currentPage')?.length).toBeFalsy();
    })
  });
})