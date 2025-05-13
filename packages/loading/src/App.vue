<script setup lang="ts">
import {Button} from '@/components/ui/button';
import Card from '@/components/card.vue';
import { ref } from 'vue';
import AnimPage from './pages/anim_.vue';
import FactPage from './pages/fact_.vue';
import { useIntervalFn } from '@vueuse/core';

const tabs = ['stat', 'anim', 'docs', 'fact'];
const selectedTab = ref('stat');

// Keeps fetching the port every few seconds until the server is open, then redirect
const abortController = ref(new AbortController());
const fetchedDate = ref<number | string>('...');
const fetchedStatus = ref<number | string>('...');
const loadingSign = ref(0)

const refetch = () => {
  abortController.value.abort();
  abortController.value = new AbortController();
  fetchedDate.value = Date.now()
  
  fetch(`http://localhost:${location.port}`, {signal: abortController.value.signal})
    .then(async (res) => {
      fetchedStatus.value = res.status;
      loadingSign.value = 1;
      setTimeout(() => loadingSign.value = 0, 100);
  
      if (res.status !== 200) return;
      const text = await res.text();
      if (text.includes('<title>BASE_ Loading</title>')) return;
      location.href = 'http://localhost:3000';
    })
    .catch((err) => {
      console.log(err);
    });
}
useIntervalFn(() => refetch(), 500, {immediate: true});
</script>
<template>
  <div class='flex flex-col gap-2 p-2 h-full'>
    <Card>
      <div class='flex gap-2 items-center'>
        LOADING PLS WAIT
        <div v-if="loadingSign === 0">_</div>
        <div v-if="loadingSign === 1">^</div>
      </div>
      <div class="flex gap-3">
        <Button v-for="tab in tabs" variant='link' :disabled="tab === selectedTab" @click="selectedTab = tab">{{ tab }}</Button>
      </div>
    </Card>
    <Card v-if="selectedTab === 'stat'" class='grow'>
      <h1>STATUS</h1>
      <p>The server is building.</p>
      <br/>
      <p>Every few seconds we will automatically fetch and route you to the BASE_ when ready.</p>
      <p>FETCHED DATE: {{ typeof fetchedDate === 'string' ? fetchedDate : new Date(fetchedDate).toISOString() }}</p>
      <p>FETCHED STATUS: {{ fetchedStatus }}</p>
      <div class="flex gap-3">
        <Button variant='link' @click="refetch()">fetch</Button>
      </div>
    </Card>
    <Card v-if="selectedTab === 'anim'" class='flex flex-col grow h-0 px-2 py-1'>
      <AnimPage/>
    </Card>
    <Card v-if="selectedTab === 'docs'" class='grow p-0 border-solid'>
      <iframe src="https://base.yskkyle.com/getting-started" frameborder="0" class='w-full h-full outline-0'/>
    </Card>
    <Card v-if="selectedTab === 'fact'" class='grow'>
      <FactPage />
    </Card>
  </div>
</template>