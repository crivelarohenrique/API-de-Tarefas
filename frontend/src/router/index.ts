import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Agenda from '@/views/Agenda.vue';
import CreateEvent from '@/views/CreateEvent.vue';
import EditEvent from '@/views/EditEvent.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';

const isAuthenticated = () => !!localStorage.getItem('token')

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    alias: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false }
  },
  {
    path: '/agenda',
    name: 'Agenda',
    component: Agenda,
    meta: { requiresAuth: true }
  },
  {
    path: '/event/create',
    name: 'CreateEvent',
    component: CreateEvent,
    meta: { requiresAuth: true }
  },
  {
    path: '/event/edit/:id',
    name: 'EditEvent',
    component: EditEvent,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(( to, from, next ) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: 'Login' })
  } else if ((to.name === 'Login' || to.name === 'Register') && isAuthenticated()) {
    next({ name: 'Agenda'})
  } else {
    next()
  }
});

export default router;
