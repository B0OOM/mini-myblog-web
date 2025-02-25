<script setup>
import { ref, onMounted,computed } from 'vue';
import { useRoute } from 'vue-router';

import Button from 'primevue/button';
import Navbar from '../components/Navbar.vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';

import router from '../router';
import backend from '../backend';

import { marked } from 'marked'; // 使用命名导出

const route = useRoute();
const articleId = route.params.id;

const post = ref([]);
const comments = ref({
  name: '',
  email: '',
  content: '',
});

const htmlContent = ref('');

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
async function getPost() {
  post.value = await backend.get(`/api/post/${articleId}`);
  post.value = post.value.post;
  post.value.UpdatedAt = formatDate(post.value.UpdatedAt);
  post.value.CreatedAt = formatDate(post.value.CreatedAt);
  htmlContent.value = marked(post.value.Content);
  console.log(post.value);
}

async function submitComment() {
  const response = await backend.post(`/api/post/${articleId}/comments`, comments.value);
  getPost();
}

onMounted(async() => {
  getPost();
});


</script>

<template>
  <div class="flex flex-col">
    <Navbar />
    <div class="bg-lime-100 flex-1">
      <div class="pt-8 px-10 text-3xl">{{ post.Title }}</div>
      <div class="pt-8 px-10 text-xl flex">
        <!-- <div class="flex-1 font-bold"><p class="text-sm font-normal">By</p>{{ "作者" }}</div> -->
        <p class="text-sm font-normal">By </p>
        <p class="text-sm px-1 font-bold">{{ post.Author }}</p>
        <p class="text-sm px-4">{{ post.UpdatedAt }}</p>
      </div>
      <div class="bg-cyan-100 pt-8 px-10 markdown-content" v-html="htmlContent"></div>
      <div class="flex flex-col pt-8 px-10">
        <p class="text-3xl mb-4">留言</p>
        <div class="flex">
          <div class="flex-1 mr-4">
            <p>* 显示名称</p>
            <InputText class="w-[100%]" type="text" placeholder="请输入名称" v-model="comments.name" />
          </div>
          <div class="flex-1 ">
            <p>* 联系邮箱地址(不会显示)</p>
            <InputText class="w-[100%]" type="text" placeholder="请输入邮箱地址" v-model="comments.email" />
          </div>
        </div>
        <div>
          <p>* 留言内容</p>
          <Textarea class="w-[100%]" variant="filled" rows="5" cols="30" v-model="comments.content" />
        </div>
        <div class="flex justify-end">
          <Button class="mt-4" label="发布评论" @click="submitComment()" />
        </div>
      </div>
      <div v-for="comment in post.Comments" :key="comment.ID" class="flex flex-col pt-8 px-10">
        <p class="text-xl">{{ comment.Author }}</p>
        <p class="text-sm">{{ formatDate(comment.CreatedAt) }}</p>
        <p class="text-sm">{{ comment.Content }}</p>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>