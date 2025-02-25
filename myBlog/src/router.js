import { createRouter, createWebHistory } from 'vue-router'

import Admin from './views/Admin.vue'
import Home from './views/Home.vue'
import Post from './views/Post.vue'
import PostEdit from './views/Postedit.vue'

//post\postedit应在地址后增加:id，前期制作先不加
const routes = [
  { path: '/', component: Home },
  { path: '/post/:id', component: Post },
  { path: '/post/edit/', component: PostEdit },
  { path: '/post/edit/:id', component: PostEdit },
  { path: '/admin', component: Admin },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;