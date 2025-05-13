<script setup lang="ts">
  import { ref } from 'vue';
  import { watchDebounced, useElementSize, useIntervalFn, useTimeoutFn } from '@vueuse/core';

  const generateRandomString = (length: number) => {
    let randomString = '';
    const appendSegment = () => {
      const text = Math.random().toString(36).toUpperCase().substring(2, length + 2);
      randomString += text;
      if (length > randomString.length) appendSegment() 
    }
    appendSegment();
    return randomString.substring(0, length);
  }
  // Builds an entire canvas of random text on init and resize
  let texts = ref<string[][]>([]);
  const container = ref<HTMLDivElement>();
  const {width: containerWidth, height: containerHeight} = useElementSize(container);
  
  const buildText = () => {
    const height = Math.min(Math.floor(containerHeight.value / 16), 48);
    const width = Math.min(Math.floor(containerWidth.value / 9.61), 72);
    texts.value = Array.from(Array(height), () => generateRandomString(width).split(''))
  };
  watchDebounced([containerWidth, containerHeight], () => buildText(), { debounce: 300, maxWait: 1000 })
  buildText()

  // Scans through the canvas line by line
  let scanLine = 0;
  useIntervalFn(() => {
    if (!texts.value[scanLine]) scanLine = 0;
    texts.value[scanLine] = generateRandomString(texts.value[scanLine].length).split('');
    scanLine++;
  }, 500)

  
  // Handle infected tiles
  const infectedCharacter = '_'
  let someInfected = [] as [number, number][];
  const infect = (lineIndex: number, charIndex: number) => {
    // Prevent infecting invalid and already infected tiles
    if (!texts.value?.[lineIndex]?.[charIndex] || texts.value[lineIndex][charIndex] === infectedCharacter) return;
    // Prevent infecting scanned tiles
    if (scanLine === lineIndex || (scanLine - 1) === lineIndex) return;
    texts.value[lineIndex][charIndex] = infectedCharacter

    someInfected.push([lineIndex, charIndex]);
  }

  useIntervalFn(() => {
    const spreadPossibility = 64 / someInfected.length
    let currentInfected = someInfected;
    someInfected = [];
    currentInfected.forEach(([lineIndex, charIndex]) => {
      if (texts.value[lineIndex][charIndex] !== infectedCharacter) return;
      const notSpread = spreadPossibility > Math.random();
      if (!notSpread) return;

      infect(lineIndex + 1, charIndex)
      infect(lineIndex - 1, charIndex)
      infect(lineIndex, charIndex + 1)
      infect(lineIndex, charIndex - 1)
    });
  }, 500)

  useTimeoutFn(() => {
    infect(Math.floor(Math.random() * texts.value.length), Math.floor(Math.random() * texts.value[0]?.length))
  }, 250)
</script>
<template>
  <div class='overflow-hidden h-0 grow leading-none' ref="container">
    <div class='absolute top-1/2 left-1/2 -translate-1/2'>
      <div v-for="(text, lineIndex) of texts" :key="lineIndex">
        <span v-for="(char, charIndex) in text" @pointerover="infect(lineIndex, charIndex)" :key="charIndex">
          {{ char }}
        </span>
      </div>
    </div>
  </div>
</template>