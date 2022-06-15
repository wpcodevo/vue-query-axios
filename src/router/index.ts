import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
} from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import RegisterView from '@/views/RegisterView.vue';
import LoginView from '@/views/LoginView.vue';
import VerifyEmailView from '@/views/VerifyEmailView.vue';
import { useAuthStore } from '@/stores/authStore';
import requireAuth from '@/router/middleware/requireAuth';
import middlewarePipeline from '@/router/middlewarePipeline';
import ProfileViewVue from '@/views/ProfileView.vue';

const routes = [
  {
    name: 'home',
    path: '/',
    component: HomeView,
  },
  {
    name: 'register',
    path: '/register',
    component: RegisterView,
  },
  {
    name: 'login',
    path: '/login',
    component: LoginView,
  },
  {
    name: 'verifyemail',
    path: '/verifyemail',
    component: VerifyEmailView,
    children: [
      {
        name: 'verifyemail',
        path: ':verificationCode',
        component: VerifyEmailView,
      },
    ],
  },
  {
    name: 'profile',
    path: '/profile',
    component: ProfileViewVue,
    meta: {
      middleware: [requireAuth],
    },
  },
];

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

router.beforeEach(
  (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const authStore = useAuthStore();

    if (!to.meta.middleware) {
      return next();
    }
    const middleware = to.meta.middleware as any;

    const context = {
      to,
      from,
      next,
      authStore,
    };

    return middleware[0]({
      ...context,
      next: middlewarePipeline(context, middleware, 1),
    });
  }
);

export default router;
