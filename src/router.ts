import { createWebHistory, createRouter } from "vue-router";
import { RouteRecordRaw } from 'vue-router';
import { useUser } from "@/store/useUser";
import { storeToRefs } from "pinia";

const routes: Array<RouteRecordRaw> = [
  { path: "/sign-in", component: () => import("@/views/SignInView.vue"), meta: { layout: 'AuthLayout' } },
  { path: "/sign-up", component: () => import("@/views/SignUpView.vue"), meta: { layout: 'AuthLayout' } },
  {
    path: "/",
    component: () => import("@/views/DashboardView.vue"),
    meta: { layout: 'DashboardLayout', requiresAuth: true }
  },
  {
    path: "/board/:boardId",
    component: () => import("@/views/BoardView.vue"),
    meta: { layout: 'BoardLayout', requiresAuth: true }
  },

  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const { isSignedIn } = storeToRefs(useUser());

  if (isSignedIn.value == undefined) next();

  if (to.meta.requiresAuth && !isSignedIn.value) {
    return '/sign-in'
  } else {
    next();
  }
})

export default router;
