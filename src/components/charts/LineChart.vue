<template>
  <svg ref="svg" :width="width" :height="height" :data-testid="props.dataTestId + '-svg'" />
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, type PropType, ref, watch } from 'vue'
import type { SummaryTypeBase } from '@types'
import { createLineChart } from './createLineChart'

const props = defineProps({
  summaries: {
    type: Array as () => SummaryTypeBase[],
    required: true,
  },
  handleOnClickSelection: {
    type: Function as PropType<(intervalDate: string) => void>,
    required: true,
  },
  dataTestId: {
    type: String,
    default: 'line-chart',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const svg = ref<SVGSVGElement | null>(null)
const width = ref(0)
const height = ref(150)

let resizeObserver: ResizeObserver | null = null

const clearChart = () => {
  if (svg.value) {
    // Clear all child elements
    svg.value.innerHTML = ''
  }
}

const createChart = async () => {
  if (!svg.value || !props.summaries?.length || width.value <= 0 || props.loading) {
    return
  }

  try {
    clearChart()
    await nextTick()
    createLineChart(svg.value, props.summaries, props.handleOnClickSelection)
  } catch (error) {
    console.error('Error creating line chart:', error)
  }
}

let resizeTimeout: ReturnType<typeof setTimeout> | null = null

const handleResize = () => {
  if (!svg.value?.parentElement) return

  if (resizeTimeout) {
    clearTimeout(resizeTimeout)
  }

  resizeTimeout = setTimeout(() => {
    if (svg.value?.parentElement) {
      const newWidth = svg.value.parentElement.getBoundingClientRect().width
      if (newWidth !== width.value && newWidth > 0) {
        width.value = newWidth
        createChart()
      }
    }
  }, 100)
}

onMounted(async () => {
  if (!svg.value) return

  const parentElement = svg.value.parentElement
  if (!parentElement) {
    console.warn('LineChart: No parent element found')
    return
  }

  width.value = parentElement.getBoundingClientRect().width

  resizeObserver = new ResizeObserver(handleResize)
  resizeObserver.observe(parentElement)

  await createChart()
})

watch(
  () => props.summaries,
  () => {
    createChart()
  },
  { deep: true },
)

watch(
  () => props.loading,
  (isLoading) => {
    if (isLoading) {
      clearChart()
    } else {
      createChart()
    }
  },
)

onBeforeUnmount(() => {
  if (resizeTimeout) {
    clearTimeout(resizeTimeout)
  }
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  clearChart()
})
</script>

<style scoped>
svg {
  width: 100%;
  height: auto;
}
</style>
