import Vue from "vue";
import VueRouter from "vue-router";
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

// 下記のrouterをmain.jsのコンストラクタに設定
export default router;
