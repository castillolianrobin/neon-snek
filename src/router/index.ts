import { RouterView, createRouter, createWebHistory } from 'vue-router'
import LayoutDefault from '@/layout/layouts/LayoutDefault.vue'
import HomeViewVue from '@/views/public/HomeView.vue';
// Middleware
// import authentication from '@/middlewares/authentication';
import { executeMiddlewares } from '@/middlewares';
// Extra Routes
// import dashboardRoutes from './dashboardRoutes';
import componentRoutes from './componentRoutes';
// Modules
import userRoutes from '@/modules/User/user.routes';
import authRoutes from '@/modules/Auth/auth.routes';
import dashboardRoutes from '@/modules/Dashboard/dashboard.routes';
import productRoutes from '@/modules/Product/product.routes';
import ordersRoutes from '@/modules/Orders/orders.routes';
import postRoutes from '@/modules/Posts/post.routes';
import { usePageLoadStore } from '@/stores/pageLoadStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeViewVue  ,
      meta: { layout: 'Default' },
    },
    {
      path: '/play',
      component: import('@/views/SnakeGameView.vue')  ,
      meta: { layout: 'Default' },
    },
    {
      path: '/',
      children: [
        ...postRoutes,  
      ]
    },
    ...authRoutes,

    // Dashboard Routes
    {
      path: '/dashboard',
      component: RouterView,
      meta: { 
        layout: 'Dashboard', 
        // middleware: [ authentication ] 
      },
      children: [
        ...dashboardRoutes,
        ...userRoutes,
        ...productRoutes,
        ...ordersRoutes,
        // ...dashboardRoutes,
      ],
    },

    // Component Kit Routes
    {
      path: '/_component',
      component: LayoutDefault,
      children: [
        ...componentRoutes.map((route)=>({
          path: route.path.substring(1),
          name: route.name,
          component: route.component,
          meta: { ...route.meta, layout: 'ComponentDashboard' },
        })),
      ],
    },
  ]
});



router.beforeEach((to, from, next)=> {
  //Set page loader to true
  const { setPageLoading } = usePageLoadStore()
  setPageLoading(true);
  
  
  if (!to.meta.middleware) return next();

  // Run middlewares
  const context = {from, next, router, to };
  return executeMiddlewares(context);
})

router.afterEach(()=>{
  //Set page loader to true
  const { setPageLoading } = usePageLoadStore()
  setPageLoading(false);
});

export default router


