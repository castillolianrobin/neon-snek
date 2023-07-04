
<script setup lang="ts">
import gql from 'graphql-tag';
import { useQuery } from '@vue/apollo-composable'
import { AppLoading, AppPagination } from '@/components/app';
import { computed, ref } from 'vue';


/** All Post Fetch Logic */

const GETPOSTS_QUERY = gql`
  query getPosts($options: PageQueryOptions) {
    posts(options: $options) {
      data {
        id
        title
        body
      }
      meta {
        totalCount
      }
    }
  }
`;

const page = ref(1);
const limit = 10;
const { 
  loading: postsLoading, 
  result: posts, 
  error: postsError,
} = useQuery<{ posts: Posts }>(GETPOSTS_QUERY, { options: { paginate: { page, limit }}}, { fetchPolicy: 'network-only' } );


/** Single Post Fetch Logic */

const GETPOST_QUERY = gql`
  query getPost($id: ID!) {
    post(id: $id) {
        id
        title
        body
    }
  }
`;

const id = ref<number | null>(null);
const postOptions = computed(()=>({ 
  enabled: id.value !== null 
}));
const { 
  loading: postLoading, 
  result: post, 
  error: postError,
} = useQuery<{ post: Post }>(GETPOST_QUERY, { id }, postOptions);




/** __TYPE DEFINITION__  */

type Posts = { data: Post[], meta: { totalCount: number }  };
type Post = { id: number, title?: string, body: string };
</script>

<template>
  <div class="md:px-20 md:py-12 h-full flex flex-col-reverse md:flex-row  md:items-stretch gap-2">
    <div class="px-2 md:w-1/3 md:h-full overflow-auto scrollbar flex-shrink-0 flex flex-col">
      <div class="pb-3 mb-6 flex gap-3 items-center justify-between border-b border-secondary-500">
        <h3 class="font-semibold text-primary-500">
          Your posts
        </h3>

        <AppPagination
        :model-value="page"
        @update:model-value="posts?.posts &&  (page = $event || 1)"
        :disabled="!posts?.posts || postsLoading" 
        :length="(posts?.posts.meta.totalCount || 10)/limit"
        class="mt-auto"
      ></AppPagination>

      </div>
      <div
        v-if="postsLoading"
        class="h-full relative"
      >
        <div class="flex flex-col gap-4">
          <div 
            v-for="loading in 10"
            :key="loading"
            class="bg-secondary-500/25 h-[30px] w-full animate-pulse"
          ></div>
        </div>
      </div>
      
      <div v-else class="flex flex-col gap-2 md:gap-5">
        <div
          v-for="(post, postI) in posts?.posts.data"
          :key="postI"
          :class="id === post.id ? 'text-primary-500' : ''"
          class="cursor-pointer hover:text-primary-300 truncate transition-all"
          @click="id = post.id"
        >

          #{{ post.id  }}: <span class="ml-1 font-semibold">{{ post.title }}</span>
        </div>
      </div>

    </div>
    <div class="p-1 md:p-5 relative border border-secondary-500 flex-grow flex-shrink">
      <div
        v-if="postLoading"
      >
        <AppLoading 
          class="h-full w-full bg-secondary-500/25 absolute top-0 left-0"
        ></AppLoading>
        <div class="flex gap-4 animate-pulse">
          <div class="bg-secondary-500/25 h-[30px] w-1/3"></div>
          <div class="bg-secondary-500/25 h-[30px] w-2/3"></div>
        </div>

        <div class="mt-6 bg-secondary-500/25 h-[100px] w-full"></div>
      </div>
      <span v-else-if="postError" class="text-error-500">
        {{ postError }}
      </span>
      <div v-else-if="post?.post">
        <h3 class="mb-2 md:mb-5 font-semibold">Title: <span class="text-primary-500">{{ post?.post.title }}</span></h3>
        <p>{{ post?.post.body }}</p>
      </div>
      <div v-else class="w-full h-full flex items-center justify-center text-secondary-500 text-xl font-semibold">
        <p>No Content to show</p>
      </div>
    </div>
  </div>
</template>
