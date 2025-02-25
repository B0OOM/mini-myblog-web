<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '../components/Navbar.vue';

import Button from 'primevue/button';
import Paginator from 'primevue/paginator';
import Select from 'primevue/select';
 

import router from '../router';
import backend from '../backend';

const home = ref();
const page = ref();
const posts = ref([]);

const pagination = ref({
  Page: 1,
  Limit: 5,
})

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function getPosts() {
  home.value = await backend.post(`/api/posts`,{
    page: pagination.value.Page,
    limit: pagination.value.Limit,
  })
  posts.value = home.value.posts.map(post => ({
    ...post,
    CreatedAt: formatDate(post.CreatedAt)
  }));
  pagination.value = home.value.pagination;
}

function firstPage() {
  pagination.value.Page = 1;
  getPosts();
}

function previousPage() {
  pagination.value.Page = pagination.value.Prev;
  getPosts();
}

function nextPage() {
  pagination.value.Page = pagination.value.Next;
  getPosts();
}

function lastPage() {
  pagination.value.Page = pagination.value.Last;
  getPosts();
}

onMounted(async () => {
  getPosts();
})
</script>

<template>
  <div class="flex flex-col">
    <Navbar />
    <div class="bg-lime-100 flex-1">
      <div class="pt-8 px-10 text-3xl font-bold">最近文章</div>
      <div v-for="post in posts" :key="post.ID" class="mt-4 mx-10 bg-white p-4">
        <router-link :to="`/post/${post.Slug}`" class="font-bold py-2 text-lg">{{ post.Title }}</router-link>
        <p class="py-2">{{ post.Desc }}</p>
        <div class="flex justify-start text-sm">
          <p v-if="post.author" class="pr-2">By</p>
          <p class="pr-4">{{ post.Author }}</p>
          <p class="px-4">{{ post.CreatedAt }}</p>
          <img src="../assets/开发图片/评论.svg" class="pl-2">
          <p class="px-1">{{ post.Comments.length }}</p>
        </div>
      </div>
      <div class="flex justify-end items-center mt-8 mx-10">
        <p class="mx-4">总计：{{ pagination.Total }}</p>
        <button class="px-2 py-1 border-2 rounded-md border-emerald-400" @click="firstPage()">第一页</button>
        <Button icon="pi pi-angle-left" rounded variant="outlined" aria-label="Filter" @click="previousPage()" />
        <Button icon="pi pi-angle-right" rounded variant="outlined" aria-label="Filter" @click="nextPage()" />
        <button class="px-2 py-1 border-2 rounded-md border-emerald-400" @click="lastPage()">最后一页</button>
        <Select class="ml-4" v-model="pagination.Limit" :options="[5, 10, 20]" @change="getPosts()" />
      </div>
    </div>
    <div class="h-16 font-bold bg-black text-white flex justify-between items-center">
      <router-link to="/admin" class="font-bold py-2 mx-24 text-lg">管理后台</router-link>
    </div>
  </div>
</template>