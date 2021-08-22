import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store/index";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    // meta 属性の正式な利用方法を把握していない
    meta: { bottom: true },
    component: Home,
    // component: () => import("@/views/Home.vue"),
  },
  {
    path: "/task",
    name: "Task",
    component: () => import("@/views/Task.vue"),
  },
  {
    path: "/analysis",
    name: "Analysis",
    component: () => import("@/views/Analysis.vue"),
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("@/views/About.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

const nextAuth = (to, from, next) => {
  // 認証が必要なページでログイン情報が無ければリダイレクト
  if (store.state.user) {
    next();
  } else {
    next({
      name: "About",
    });
  }
};

router.beforeEach((to, from, next) => {
  if (to.name !== "About") {
    if (store.state.checkedAuthState) {
      // store.state.user || next({ name: "About" });
      nextAuth(to, from, next);
    } else {
      const unwatch = store.watch(
        (state) => state.checkedAuthState,
        () => {
          unwatch();
          nextAuth(to, from, next);
        }
      );
    }
  } else {
    next();
  }
});

// 下記のrouterをmain.jsのコンストラクタに設定
export default router;
