import { createRouter, createWebHistory } from 'vue-router'
import SnakeGame from '@/views/SnakeGameView.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: SnakeGame  ,
      meta: { layout: 'Default' },
    },
  ]
});


export default router


