<script setup lang="ts">
import type { BadgeVariants } from '../ui/badge';

const { articlePath, variant } = defineProps<{ articlePath: string, variant?: BadgeVariants['variant'] }>()
const pathSplit = articlePath.split('/');
const dateString = pathSplit[pathSplit.length - 1]?.split('.')[0];

const dayjs = useDayjs();
const date = dayjs(dateString);

if (!date.isValid()) pathSplit[pathSplit.length - 1] = `${dayjs().format('YYYY-MM-DD')}.${pathSplit[pathSplit.length - 1]}.md`
</script>
<template>
    <UiBadge v-if="date.isValid()" :variant="variant" class="flex gap-2">
        <Icon name="lucide:calendar" />
        {{ date.fromNow() }}
    </UiBadge>
    <UiTooltip v-else>
        <UiTooltipTrigger>
            <UiBadge variant='destructive' class="flex gap-2">
                <Icon name="lucide:calendar" />
                Please Provide A Publication Date
            </UiBadge>
        </UiTooltipTrigger>
        <UiTooltipContent class='flex flex-col gap-1 items-start'>
            <p>Please include published date in the file name. For Example:</p>
            <code class='bg-muted text-muted-foreground rounded font-mono font-semibold px-2 py-1'>{{pathSplit.join('/')}}</code>
        </UiTooltipContent>
    </UiTooltip>
</template>