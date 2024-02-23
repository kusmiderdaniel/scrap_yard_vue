import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Dashboard from '../views/dashboard/Dashboard.vue'
import SignUp from '../views/SignUp.vue'
import LogIn from '../views/LogIn.vue'
import MyAccount from '../views/archive/MyAccount.vue'
import EditTeam from '../views/dashboard/EditTeam.vue'
import Clients from '../views/dashboard/Clients.vue'
import Client from '../views/dashboard/Client.vue'
import AddClient from '../views/dashboard/AddClient.vue'
import EditClient from '../views/dashboard/EditClient.vue'
import Items from '../views/dashboard/Items.vue'
import ItemStatistics from '../views/dashboard/ItemStatistics.vue'
import AddCategory from '../views/dashboard/AddCategory.vue'
import AddItem from '../views/dashboard/AddItem.vue'
import EditItem from '../views/dashboard/EditItem.vue'
import Receipts from '../views/dashboard/Receipts.vue'
import ReceiptsAcounting from '../views/dashboard/ReceiptsAcounting.vue'
import AddReceipt from '../views/dashboard/AddReceipt.vue'
import Receipt from '../views/dashboard/Receipt.vue'
import EditReceipt from '../views/dashboard/EditReceipt.vue'

import store from '../store'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/log-in',
    name: 'Login',
    component: LogIn
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/dashboard/my-account',
    name: 'MyAccount',
    component: MyAccount,
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/dashboard/my-account/edit-team',
    name: 'EditTeam',
    component: EditTeam,
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/dashboard/clients',
    name: 'Clients',
    component: Clients,
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/dashboard/clients/add',
    name: 'AddClient',
    component: AddClient,
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/dashboard/clients/:id',
    name: 'Client',
    component: Client,
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/dashboard/clients/:id/edit',
    name: 'EditClient',
    component: EditClient,
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/dashboard/items',
    name: 'Items',
    component: Items,
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/dashboard/items/stats',
    name: 'ItemStatistics',
    component: ItemStatistics,
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/dashboard/items/add-category',
    name: 'AddCategory',
    component: AddCategory,
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/dashboard/items/add-item',
    name: 'AddItem',
    component: AddItem,
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/dashboard/items/:id/edit',
    name: 'EditItem',
    component: EditItem,
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/dashboard/receipts',
    name: 'Receipts',
    component: Receipts,
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/dashboard/receipts/accounting',
    name: 'ReceiptsAcounting',
    component: ReceiptsAcounting,
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/dashboard/receipts/add-receipt',
    name: 'AddReceipt',
    component: AddReceipt,
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/dashboard/receipts/:id',
    name: 'Receipt',
    component: Receipt,
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/dashboard/receipts/:id/edit',
    name: 'EditReceipt',
    component: EditReceipt,
    meta: {
      requireLogin: true
    }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
