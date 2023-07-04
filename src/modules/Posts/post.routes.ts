import type { NavigationItem } from "@/layout/layouts/LayoutDashboard/LayoutDashboardSideBarItem.vue";
import { RouterView, type RouteRecordRaw } from "vue-router";

export default [
  {
    path: 'post',
    component: RouterView,
    name: 'Post',
    label: 'Posts',
    // icon: () => import('@heroicons/vue/24/solid/ShoppingCartIcon'),
    meta: { title: 'Posts' },
    children: [
      {
        name: 'PostList',
        path: 'list',
        label: 'Post List',
        component: ()=> import('./views/PostListView.vue'),
      },
    ],
  }
] as Route[]

type Route = NavigationItem & RouteRecordRaw;
