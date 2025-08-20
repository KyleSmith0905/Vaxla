<script setup lang="tsx">
import { Card, CardTitle, CardDescription, CardContent, CardHeader } from '~/components/ui/card';
import GridCollection from '~/components/utility/grid-collection/index.vue';
import UtilityGridCollectionItem from '~/components/utility/grid-collection/item.vue';
import { Badge } from '~/components/ui/badge';
import DateBadge from '~/components/utility/date-badge.vue';

const { data: articles } = await useFetch('/api/articles/list');

const flattenedArticle = computed(() => articles.value?.articles ?? []);

definePageMeta({
	layout: false,
});
</script>

<template>
	<NuxtLayout name="default" :path="['Articles']">
		<Card>
			<CardHeader>
				<CardTitle>Articles</CardTitle>
				<CardDescription v-if="!flattenedArticle || flattenedArticle.length === 0">There are no articles.</CardDescription>
				<CardDescription v-else-if="flattenedArticle.length === 1">There is 1 article.</CardDescription>
				<CardDescription v-else>There are {{ flattenedArticle.length }} articles.</CardDescription>
			</CardHeader>
			<CardContent v-if="flattenedArticle && flattenedArticle.length > 0" class="px-0 pb-0">
				<GridCollection :items="flattenedArticle?.length ?? 0" variant="card">
					<UtilityGridCollectionItem v-for="article in flattenedArticle ?? []" :key="article.fileName">
						<NuxtLink :to="`articles/${article.fileName}`" class="flex flex-col gap-1 h-full px-3 pb-3 pt-2 hover:bg-accent/50">
							<h2 class="font-bold">{{ article.title }}</h2>
							<div class="flex gap-2">
								<Badge v-if="article.metadata.author" variant="outline" class="flex gap-2">
									<Icon icon="lucide:user-round" />
									{{ article.metadata.author }}
								</Badge>
								<DateBadge :date="article.uploadDate" variant='outline'/>
							</div>
							<p v-if="article.metadata.description" class="text-muted-foreground">{{ article.metadata.description }}</p>
							<p v-if="article.error" class="text-destructive italic text-sm">{{ article.error }}</p>
						</NuxtLink>
					</UtilityGridCollectionItem>
				</GridCollection>
			</CardContent>
		</Card>
	</NuxtLayout>
</template>
