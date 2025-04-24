<script setup lang="tsx">
const { data: navigation } = await useAsyncData('article-navigation', () => queryCollectionNavigation('articles', ['description', 'author']));

const flattenedArticle = computed(() => navigation.value?.[0]?.children);

definePageMeta({
	layout: false,
});
</script>

<template>
	<NuxtLayout name="default" :path="['Articles']">
		<UiCard>
			<UiCardHeader>
				<UiCardTitle>Articles</UiCardTitle>
				<UiCardDescription v-if="!flattenedArticle || flattenedArticle.length === 0">There are no articles.</UiCardDescription>
				<UiCardDescription v-else-if="flattenedArticle.length === 1">There is 1 article.</UiCardDescription>
				<UiCardDescription v-else>There are {{ flattenedArticle.length }} articles.</UiCardDescription>
			</UiCardHeader>
			<UiCardContent v-if="flattenedArticle && flattenedArticle.length > 0" class="px-0 pb-0">
				<UtilityGridCollection :items="flattenedArticle?.length ?? 0" variant="card">
					<UtilityGridCollectionItem v-for="article in flattenedArticle ?? []" :key="article.path">
						<NuxtLink :to="article.path" class="flex flex-col gap-1 h-full px-3 pb-3 pt-2 hover:bg-accent/50">
							<h2 class="font-bold">{{ article.title }}</h2>
							<div class="flex gap-2">
								<UiBadge v-if="article.author" variant="outline" class="flex gap-2">
									<Icon name="lucide:user-round" />
									{{ article.author }}
								</UiBadge>
								<UtilityDateBadge :articlePath="article.path" variant='outline'/>
							</div>
							<p class="text-muted-foreground">{{ article.description }}</p>
						</NuxtLink>
					</UtilityGridCollectionItem>
				</UtilityGridCollection>
			</UiCardContent>
		</UiCard>
	</NuxtLayout>
</template>
