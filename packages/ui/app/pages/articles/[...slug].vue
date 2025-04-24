<script setup lang="ts">
const route = useRoute();
const dayjs = useDayjs();

const { data } = await useAsyncData('article', () => {
  return queryCollection('articles').path(route.path).select('author', 'description', 'title', 'body', 'path').first()
})

definePageMeta({
  layout: false,
})
</script>

<template>
  <NuxtLayout name="default" :path="['Articles', data?.title ?? '']">
    <UiButton variant='outline' as-child class='w-fit'>
      <NuxtLink to="/articles">
        <Icon name='lucide:move-left'/>
        Back
      </NuxtLink>
    </UiButton>
    <UiCard>
      <UiCardHeader class='py-4 px-6'>
        <UiCardTitle v-if="data?.title">{{ data.title }}</UiCardTitle>
        <UiCardDescription v-if="data?.description">{{ data.description }}</UiCardDescription>
        <div class='flex gap-1'>
          <UiBadge v-if="data?.author" class='flex gap-2'><Icon name="lucide:user-round"/>{{ data.author }}</UiBadge>
          <UtilityDateBadge :articlePath="data?.path ?? ''" />
        </div>
      </UiCardHeader>
      <UiSeparator/>
      <UiCardContent class='py-4 px-6'>
        <ContentRenderer class="prose prose-zinc prose-invert min-w-full" :value='data as any'/>
      </UiCardContent>
    </UiCard>
  </NuxtLayout>
</template>
