<script setup lang="ts">
import type { BadgeVariants } from '../ui/badge';
import { Icon } from '@iconify/vue';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';

const { date: dateNumber, variant } = defineProps<{ date: number, variant?: BadgeVariants['variant'] }>()

const dayjs = useDayjs();
const date = dayjs(dateNumber);

const currentDate = dayjs().format('YYYY-MM-DD')
</script>
<template>
    <Badge v-if="date.isValid()" :variant="variant" class="flex gap-2">
        <Icon icon="lucide:calendar" />
        {{ date.fromNow() }}
    </Badge>
</template>