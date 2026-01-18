<template>
  <div>
    <h2>Loan Interest Equation</h2>
    <div ref="equationRef"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import katex from 'katex'
import 'katex/dist/katex.min.css'

export default defineComponent({
  name: 'LoanInterestEquation',
  setup() {
    const equationRef = ref<HTMLDivElement | null>(null)

    const renderEquation = () => {
      const equation = `
        \\text{Interest} = P \\times r \\times t \\\\
        \\text{where:} \\\\
        P = \\text{Principal (loan amount)} \\\\
        r = \\text{Interest rate per period} \\\\
        t = \\text{Number of periods}
      `
      if (equationRef.value) {
        katex.render(equation, equationRef.value, {
          throwOnError: false,
        })
      }
    }

    onMounted(() => {
      renderEquation()
    })

    return { equationRef, renderEquation }
  },
})
</script>

<style scoped></style>
