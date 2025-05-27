<script setup lang="ts">
import type { BadgeVariants } from '../ui/badge';
import { Icon } from '@iconify/vue';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';

const { articlePath, variant } = defineProps<{ articlePath: string, variant?: BadgeVariants['variant'] }>()
const pathSplit = articlePath.split('/');
const dateString = pathSplit[pathSplit.length - 1]?.split('.')[0];

const dayjs = useDayjs();
const date = dayjs(dateString);

if (!date.isValid()) pathSplit[pathSplit.length - 1] = `${dayjs().format('YYYY-MM-DD')}.${pathSplit[pathSplit.length - 1]}.md`
</script>
<template>
    <Badge v-if="date.isValid()" :variant="variant" class="flex gap-2">
        <Icon icon="lucide:calendar" />
        {{ date.fromNow() }}
    </Badge>
    <Tooltip v-else>
        <TooltipTrigger>
            <Badge variant='destructive' class="flex gap-2">
                <Icon icon="lucide:calendar" />
                Please Provide A Publication Date
            </Badge>
        </TooltipTrigger>
        <TooltipContent class='flex flex-col gap-1 items-start'>
            <p>Please include published date in the file name. For Example:</p>
            <code class='bg-muted text-muted-foreground rounded font-mono font-semibold px-2 py-1'>{{pathSplit.join('/')}}</code>
        </TooltipContent>
    </Tooltip>
</template>