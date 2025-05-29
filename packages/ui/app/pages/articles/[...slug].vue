<script setup lang="ts">
import { Button } from '~/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { Badge } from '~/components/ui/badge';
import DateBadge from '~/components/utility/date-badge.vue';
import { Icon } from '@iconify/vue';

const route = useRoute();

const { data: article } = await useAsyncData('article-navigation', () => $fetch('/api/articles/retrieve', {query: {fileName: route.params.slug}}));

definePageMeta({
  layout: false,
})
</script>

<template>
  <NuxtLayout name="default" :path="['Articles', article?.title ?? '']">
    <Button variant='outline' as-child class='w-fit'>
      <NuxtLink to="/articles">
        <Icon icon='lucide:move-left'/>
        Back
      </NuxtLink>
    </Button>
    <Card>
      <CardHeader class='py-4 px-6'>
        <CardTitle v-if="article?.title">{{ article.title }}</CardTitle>
        <CardDescription v-if="article?.metadata.description">{{ article.metadata.description }}</CardDescription>
        <div class='flex gap-1'>
          <Badge v-if="article?.metadata.author" class='flex gap-2'><Icon icon="lucide:user-round"/>{{ article.metadata.author }}</Badge>
          <DateBadge v-if="article?.uploadDate" :date="article.uploadDate" />
        </div>
      </CardHeader>
      <Separator/>
      <CardContent class='py-4 px-6'>
        <MDC class="prose prose-zinc dark:prose-invert min-w-full" :value='article?.document!'/>
      </CardContent>
    </Card>
  </NuxtLayout>
</template>
