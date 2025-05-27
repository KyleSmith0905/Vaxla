<script setup lang="ts">
import { Button } from '~/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { Badge } from '~/components/ui/badge';
import DateBadge from '~/components/utility/date-badge.vue';
import { Icon } from '@iconify/vue';

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
    <Button variant='outline' as-child class='w-fit'>
      <NuxtLink to="/articles">
        <Icon icon='lucide:move-left'/>
        Back
      </NuxtLink>
    </Button>
    <Card>
      <CardHeader class='py-4 px-6'>
        <CardTitle v-if="data?.title">{{ data.title }}</CardTitle>
        <CardDescription v-if="data?.description">{{ data.description }}</CardDescription>
        <div class='flex gap-1'>
          <Badge v-if="data?.author" class='flex gap-2'><Icon icon="lucide:user-round"/>{{ data.author }}</Badge>
          <DateBadge :articlePath="data?.path ?? ''" />
        </div>
      </CardHeader>
      <Separator/>
      <CardContent class='py-4 px-6'>
        <ContentRenderer class="prose prose-zinc dark:prose-invert min-w-full" :value='data as any'/>
      </CardContent>
    </Card>
  </NuxtLayout>
</template>
