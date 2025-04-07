<script setup lang="ts">
const { data: navigation } = await useAsyncData('blog-navigation', () => fetchContentNavigation());

const flattenedBlog = computed(() => navigation.value?.[0]?.children);

const dayjs = useDayjs();

definePageMeta({
	layout: false,
});
</script>

<template>
	<NuxtLayout name="default" :path="['Blogs']">
		<UiCard>
			<UiCardHeader>
				<UiCardTitle>Blogs</UiCardTitle>
				<UiCardDescription v-if="!flattenedBlog || flattenedBlog.length === 0">There are no blogs.</UiCardDescription>
				<UiCardDescription v-else-if="flattenedBlog.length === 1">There is 1 blog.</UiCardDescription>
				<UiCardDescription v-else>There are {{ flattenedBlog.length }} blogs.</UiCardDescription>
			</UiCardHeader>
			<UiCardContent class="px-0 pb-0">
				<UtilityGridCollection :items="flattenedBlog?.length ?? 0" variant="card">
					<UtilityGridCollectionItem v-for="blog in flattenedBlog ?? []" :key="blog._id">
						<NuxtLink :to="blog._path" class="flex flex-col gap-1 px-3 pb-3 pt-2 hover:bg-accent/50">
							<h2 class="font-bold">{{ blog.title }}</h2>
							<div class="flex gap-2">
								<UiBadge variant="outline" class="flex gap-2">
									<Icon name="lucide:user-round" />
									{{ blog.author }}
								</UiBadge>
								<UiBadge variant="outline" class="flex gap-2">
									<Icon name="lucide:calendar" />
									{{ dayjs(blog.publishedAt).fromNow() }}
								</UiBadge>
							</div>
							<p class="text-muted-foreground">{{ blog.description }}</p>
						</NuxtLink>
					</UtilityGridCollectionItem>
				</UtilityGridCollection>
			</UiCardContent>
		</UiCard>
	</NuxtLayout>
</template>
