<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui/button';

const facts = [
  'You may close this tab with (Window and Linux) "Ctrl + w" or (Mac) "⌘ + w"',
	'Delete complete words with (Window and Linux) "Ctrl + Backspace"',
	'Save all files in your project with (Windows and Linux) "Ctrl + k -> s"',
	'Although WebPs are smaller than PNGs on average, on rare circumstances PNGs may be smaller',
	'JavaScript was developed in 10 days',
	'Number.isNaN !== Number.isNaN',
	'TypeScript\'s codebase was written in TypeScript',
	'The average webpage is 2.2MB',
  'Feel free to create an issue and suggest fun facts',
  'BASE_ was originally made to handle the complex environments at Sparrow Design',
  'Our internal BASE_ project at Sparrow Design was developed over a weekend',
  'BASE_ is fully open source and welcomes all contributors',
]
const randomFact = ref(Math.floor(Math.random() * facts.length));
const getRandomFact = () => {
  const beforeFact = randomFact.value;
  const loopUntilRandom = () => {
    randomFact.value = Math.floor(Math.random() * facts.length)
    if (beforeFact === randomFact.value) loopUntilRandom();
  }
  loopUntilRandom();
}
</script>
<template>
  <h1>RANDOM FACTS</h1>
  <p>{{randomFact}}: {{ facts[randomFact] }}</p>
  <div class="flex gap-3">
    <Button variant='link' @click="getRandomFact()">random</Button>
  </div>
  <Button as-child variant='link'>
    <a href="https://github.com/KyleSmith0905/BASE_/issues/new?title=[Fun+Fact+Suggestion]:+" target="_blank">
      suggest
    </a>
  </Button>
</template>