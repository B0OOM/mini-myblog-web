<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '../components/Navbar.vue';

import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Select from 'primevue/select';

import backend from '../backend';

const router = useRouter();

const columns = [
  { field: 'Title', header: '标题' },
  { field: 'Author', header: '作者' },
  { field: 'CreatedAt', header: '创建时间' },
  { field: 'CommentsNum', header: '评论数' },
];

const pagination = ref({
  Page: 1,
  Limit: 5,
})

const posts = ref([]);

// const navigateToEdit = (product) => {
//   router.push({ name: 'EditArticle', params: { id: products.code } });
// };

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function getPosts() {
  posts.value = await backend.post(`/api/posts`,{
    page: pagination.value.Page,
    limit: pagination.value.Limit,
  })
  pagination.value = posts.value.pagination;
  posts.value = posts.value.posts.map(post => ({
    ...post,
    UpdatedAt: formatDate(post.UpdatedAt),
    CreatedAt: formatDate(post.CreatedAt),
    CommentsNum: post.Comments.length,
  }));
}

const navigateToEdit = (product) => {
  router.push({ path: `/post/edit/${product.Slug}` });
};

async function deletePost(product) {
  await backend.get(`/api/admin/delete/post?post_id=${product.ID}`)
  getPosts();
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
  <div class="flex flex-col h-[100vh]">
    <Navbar />
    <div class="bg-lime-100 flex-1">
      <div class="flex justify-between items-center mx-24 mt-8">
        <p class="font-bold text-2xl">Mini blog 管理后台</p>
        <Button label="新增文章" as="router-link" to="/post/edit/" />
      </div>
      <div class="mx-24 mt-4">
        <DataTable :value="posts" tableStyle="min-width: 50rem">
          <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" :style="{ maxWidth: col.field === 'Title' ? '300px' : 'auto' }" >
            <template #body="{ data }">
              <div v-if="col.field !== 'Title'">
                {{ data[col.field] }}
              </div>
              <div v-if="col.field === 'Title'">
                <router-link :to="`/post/edit/${data.Slug}`" class="text-lg">{{ data.Title }}</router-link>
                <p class="text-sm">{{ data.Desc }}</p>
              </div>
            </template>
          </Column>
          <Column header="操作" >
              <template #body="{ data }">
                <div class="flex space-x-2">
                  <button @click="navigateToEdit(data)">编辑</button>
                  <button class="text-rose-600" @click="deletePost(data)">删除</button>
                </div>
              </template>
            </Column>
        </DataTable>
      </div>
      <div class="flex justify-end items-center mt-8 mx-24">
        <p class="mx-4">总计：{{ pagination.Total }}</p>
        <button class="px-2 py-1 border-2 rounded-md border-emerald-400" @click="firstPage()">第一页</button>
        <Button icon="pi pi-angle-left" rounded variant="outlined" aria-label="Filter" @click="previousPage()" />
        <Button icon="pi pi-angle-right" rounded variant="outlined" aria-label="Filter" @click="nextPage()" />
        <button class="px-2 py-1 border-2 rounded-md border-emerald-400" @click="lastPage()">最后一页</button>
        <Select class="ml-4" v-model="pagination.Limit" :options="[5, 10, 20]" @change="getPosts()" />
      </div>
    </div>

  </div>

</template>