<script setup lang="ts">
defineProps<{
  class?: string;
}>();
</script>
<template>
	<code class="bg-muted text-muted-foreground w-fit rounded px-2 py-1 font-mono text-xs font-semibold" :class="class">
		<slot />
	</code>
</template>