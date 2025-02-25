<script setup>
import { ref, onMounted } from 'vue'
import { useRoute,useRouter } from 'vue-router';


import Navbar from '../components/Navbar.vue';

import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';

import backend from '../backend';


const route = useRoute();
const router = useRouter();
const articleId = route.params.id;

const post = ref(
  {
    CreatedAt: '',
    UpdatedAt: '',
    Title: '',
    Slug: '',
    Author: '',
    Keywords: '',
    Desc: '',
    Content: '',
    Position:null,
    Comments: [],
  }
);
const postTitle = ref('');

async function getEditPost() {
  post.value = await backend.get(`/api/post/${articleId}`);
  post.value = post.value.post;
  postTitle.value = post.value.Title;
  console.log(post.value);
}

async function editPost() {
  console.log(post.value);
  console.log(articleId);
  try {
    if (articleId) {
      const response = await backend.post(`/api/admin/edit`, post.value);
      console.log(response);
      getEditPost(); // 重新获取文章数据并显示在当前页面
    } else {
      post.value.CreatedAt = new Date().toISOString();
      post.value.UpdatedAt = new Date().toISOString();
      const response = await backend.post(`/api/admin/post`, post.value);
      console.log(post.value);
      router.push(`/admin`); // 创建新文章后导航到管理后台
    }
  } catch (error) {
    console.error('Error:', error);
    // 处理错误，例如显示错误消息给用户
  }
}
onMounted(async () => {
  if (articleId) {
    getEditPost();
  }
});

</script>

<template>
  <div class="flex flex-col justify-center items-center bg-lime-100">
    <Navbar />
    <div class="flex-1 w-[90vw]">
      <div class="flex my-6 mx-8">
        <a href="/admin" class="text-xl font-bold">管理后台</a>
        <p class="text-xl mx-3"> > </p>
        <p class="text-xl font-bold">{{ postTitle }}</p>
      </div>
      <div v-if="articleId" class="flex justify-between">
        <p class="text-3xl font-bold mx-12">编辑文章</p>
        <router-link :to="`/post/${post.Slug}`" class="mx-12">查看文章</router-link>
      </div>
      <div v-else class="flex justify-between">
        <p class="text-3xl font-bold mx-12">创建文章</p>
      </div>
      <div class="flex flex-col mx-12">
        <div>
          <p class="text-xl">标题</p>
          <InputText type="text" v-model="post.Title" class="w-[100%] mt-1" />
        </div>
        <div class="flex justify-between mt-4">
          <div class="w-[35%] flex-1 mr-8">
            <p class="text-xl">文章标识</p>
            <InputText type="text" v-model="post.Slug" class="w-[100%] mt-1" />
          </div>
          <div class="w-[35%] flex-1 mr-8">
            <p class="text-xl">文章作者</p>
            <InputText type="text" v-model="post.Author" class="w-[100%] mt-1" />
          </div>
          <div>
            <p class="text-xl">排序</p>
            <InputNumber v-model="post.Position" showButtons class="mt-1" />
          </div>
        </div>
        <div>
          <p class="text-xl mt-4">关键词 每个词用“,”分开</p>
          <InputText type="text" v-model="post.Keywords" class="w-[100%] mt-1" />
        </div>
        <div>
          <p class="text-xl mt-4">文章描述</p>
          <Textarea v-model="post.Desc" variant="filled" rows="3" cols="30" class="w-[100%] mt-1" />
        </div>
        <div>
          <p class="text-xl mt-4">文章正文(Markdown格式)</p>
          <Textarea v-model="post.Content" variant="filled" rows="10" cols="30" class="w-[100%] mt-1" />
        </div>
        <div v-if="articleId">
          <Button class="mt-4" label="编辑文章" @click="editPost()" />
        </div>
        <div v-else>
          <Button class="mt-4" label="创建文章" @click="editPost()" />
        </div>
      </div>
    </div>
  </div>
</template>