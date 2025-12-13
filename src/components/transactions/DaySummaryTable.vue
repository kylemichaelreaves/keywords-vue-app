<template>
  <el-card>
    <el-row>
      <el-col>
        <el-table
          v-if="daySummaryData"
          :data="daySummaryData"
          table-layout="auto"
          size="large"
          :loading="isFetching"
          layout="auto"
          show-summary
        >
          <el-table-column
            v-for="column in columns"
            :key="column.prop"
            :prop="column.prop"
            :label="column.label"
          />
        </el-table>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { ElCard, ElTable, ElTableColumn } from 'element-plus'
import { useTransactionsStore } from '@stores/transactions'
import useDaySummary from '@api/hooks/timeUnits/days/useDaySummary.ts'

const store = useTransactionsStore()

// TODO refactor, or duplicate component to have one that can accept props

const { data, refetch, isFetching } = useDaySummary()

const daySummaryData = computed(() => data.value)

// Generate columns based on the keys of the first object in the data array
const columns = computed(() => {
  return daySummaryData.value && daySummaryData.value[0]
    ? Object.keys(daySummaryData.value[0]).map((key) => ({ prop: key, label: key }))
    : []
})

watch(
  () => store.selectedDay,
  () => {
    refetch()
  },
)
</script>
