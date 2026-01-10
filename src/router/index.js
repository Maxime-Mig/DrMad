import { createRouter, createWebHistory } from 'vue-router'
import VirusesView from "@/views/VirusesView.vue";

const routes = [
  // route pour afficher la liste des virus
  {
    path: '/shop/items',
    name: 'shopitems',
    component: VirusesView
  },
  // route pour se loguer
  {
    path: '/shop/login',
    name: 'shoplogin',
    // import dynamique du composant, plutôt qu'en début de fichier, comme la 1ère route.
    component: () => import('@/views/ShopLogin.vue')
  },
  // route pour accéder au compte bancaire
  {
    path: '/bank/account',
    name: 'bankaccount',
    // import dynamique du composant, plutôt qu'en début de fichier, comme la 1ère route.
    component: () => import('@/views/BankAccountView.vue')
  },
  {
    path: '/shop',
    name: 'shop',
    component: () => import('@/views/ShopView.vue'),
    children: [
      {
        path: 'home',
        name: 'shophome',
        components: { shopmain: () => import('@/views/ShopHome.vue') },
        alias: '/shop'
      },
      {
        path: 'login',
        name: 'shoplogin',
        components: { shopmain: () => import('@/views/ShopLogin.vue') }
      },
      {
        path: 'buy',
        name: 'shopbuy',
        components: { shopmain: () => import('@/views/ShopBuy.vue') }
      },
      {
        path: 'pay/:orderId',
        name: 'shoppay',
        components: { shopmain: () => import('@/views/ShopPay.vue') },
        props: { shopmain: (route) => ({ orderUuid: route.params.orderId }) }
      },
      {
        path: 'orders',
        name: 'shoporders',
        components: { shopmain: () => import('@/views/ShopOrders.vue') }
      },
    ]
  }

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
