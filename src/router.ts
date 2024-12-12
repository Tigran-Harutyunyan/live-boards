import { createWebHistory, createRouter } from "vue-router";
import { RouteRecordRaw } from 'vue-router';
import { useUser } from "@/store/useUser";
import { storeToRefs } from "pinia";

const routes: Array<RouteRecordRaw> = [
  { path: "/sign-in", component: () => import("@/views/SignInView.vue") },
  { path: "/sign-up", component: () => import("@/views/SignUpView.vue") },
  {
    path: "/",
    component: () => import("@/views/DashboardView.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/board/:boardId",
    component: () => import("@/views/BoardView.vue"),
    meta: { requiresAuth: true }
  },

  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const { isSignedIn } = storeToRefs(useUser());

  if (to.meta.requiresAuth && isSignedIn.value !== undefined && !isSignedIn.value) {
    next('/sign-in');
  } else {
    next();
  }
})

export default router;
