import { createRouter, createWebHistory } from "vue-router";
import VirusesView from "@/views/VirusesView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/DrMadHome.vue"),
  },
  // route pour afficher la liste des virus
  {
    path: "/shop/items",
    name: "shopitems",
    component: VirusesView,
  },

  {
    path: "/shop/logout",
    name: "shoplogout",
    component: () => import("@/views/ShopLogout.vue"),
  },
  // Routes Banque
  {
    path: "/bank",
    component: () => import("@/views/BankView.vue"),
    children: [
      {
        path: "home",
        alias: "", // /bank alias
        name: "bankhome",
        components: { bankmain: () => import("@/views/BankHome.vue") },
      },
      {
        path: "account",
        name: "bankaccount",
        components: { bankmain: () => import("@/views/BankAccountView.vue") },
      },
      {
        path: "amount",
        name: "bankamount",
        components: { bankmain: () => import("@/views/BankAmount.vue") },
      },
      {
        path: "operation",
        name: "bankoperation",
        components: { bankmain: () => import("@/views/BankOperation.vue") },
      },
      {
        path: "history",
        name: "bankhistory",
        components: { bankmain: () => import("@/views/BankHistory.vue") },
      },
      {
        path: "logout",
        name: "banklogout",
        components: { bankmain: () => import("@/views/BankLogout.vue") },
      },
    ],
  },
  {
    path: "/shop",
    name: "shop",
    component: () => import("@/views/ShopView.vue"),
    children: [
      {
        path: "home",
        name: "shophome",
        components: { shopmain: () => import("@/views/ShopHome.vue") },
        alias: "/shop",
      },
      {
        path: "login",
        name: "shoplogin-nested",
        components: { shopmain: () => import("@/views/ShopLogin.vue") },
      },
      {
        path: "buy",
        name: "shopbuy",
        components: { shopmain: () => import("@/views/ShopBuy.vue") },
      },
      {
        path: "pay/:orderId?",
        name: "shoppay",
        components: { shopmain: () => import("@/views/ShopPay.vue") },
        props: {
          shopmain: (route) => ({ orderUuid: route.params.orderId || "" }),
        },
      },
      {
        path: "orders",
        name: "shoporders",
        components: { shopmain: () => import("@/views/ShopOrders.vue") },
      },
      {
        path: "logout",
        name: "shoplogout-nested",
        components: { shopmain: () => import("@/views/ShopLogout.vue") },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

export default router;
