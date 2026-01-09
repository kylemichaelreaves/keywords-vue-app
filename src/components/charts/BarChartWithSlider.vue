<template>
  <div class="chart-container">
    <div class="chart-slider-wrapper">
      <div ref="chartContainer" class="d3-chart"></div>
      <div class="slider-container">
        <el-slider
          v-model="thresholdValue"
          :min="minAmount"
          :max="maxAmount"
          :step="1"
          vertical
          height="400px"
          :format-tooltip="formatTooltip"
          @input="updateThresholdLine"
        />
      </div>
    </div>
    <!-- TODO useTippy for displaying tooltip-table & abstract tooltip-table to its own component -->
    <div
      v-if="popoverVisible && selectedMonth"
      class="custom-popover"
      :style="{
        left: popoverPosition.x + 'px',
        top: popoverPosition.y + 'px'
      }"
    >
      <el-card shadow="hover" class="popover-card">
        <el-table :data="selectedMonth.transactions" style="width: 100%" max-height="300" size="small">
          <!-- TODO iterate over an object instead of this brutish and shambolic repetition! -->
          <el-table-column prop="date" label="Date" width="100" />
          <el-table-column prop="transactionNumber" label="Transaction #" width="120" />
          <el-table-column prop="description" label="Description" min-width="150" />
          <el-table-column prop="memo" label="Memo" min-width="150" />
          <el-table-column prop="amountDebit" label="Amount" width="100" align="right"/>
          <el-table-column prop="budgetCategory" label="Category" width="120" />
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, reactive, defineProps } from 'vue'
import { ElSlider, ElTable, ElTableColumn, ElCard } from 'element-plus'
import * as d3 from 'd3'
import type { Transaction } from '@types'
import { createBarChart } from '@components/charts/createBarChart.ts'


interface MonthlyData {
  month: string;
  amount: number;
  transactions: Partial<Transaction>[];
}

defineProps({
  monthlyData: {
    type: Array as () => MonthlyData[],
    required: true
  }
})

const popoverVisible = ref(false)
const popoverPosition = reactive({ x: 0, y: 0 })
const selectedMonth = ref<MonthlyData | null>(null)

const chartContainer = ref<HTMLElement | null>(null)

// TODO remove and abstract into props via defineProps
const data = ref<MonthlyData[]>([
  {
    month: 'Jan',
    amount: 1000,
    transactions: [
      {
        id: 101,
        transaction_number: 'TX-2025-001',
        date: '2025-01-05',
        description: 'Software License',
        memo: 'Annual software renewal',
        memo_id: 1001,
        amount_debit: '350.00',
        budget_category: 'Software'
      },
      {
        id: 102,
        transaction_number: 'TX-2025-002',
        date: '2025-01-12',
        description: 'Consulting Fee',
        memo: 'Project consultation',
        memo_id: 1002,
        amount_debit: '450.00',
        budget_category: 'Services'
      },
      {
        id: 103,
        transaction_number: 'TX-2025-003',
        date: '2025-01-25',
        description: 'Equipment Sale',
        memo: 'Used equipment',
        memo_id: 1003,
        amount_credit: '200.00',
        budget_category: 'Equipment'
      }
    ]
  },
  {
    month: 'Feb',
    amount: 1500,
    transactions: [
      {
        id: 104,
        transaction_number: 'TX-2025-004',
        date: '2025-02-03',
        description: 'Project Payment',
        memo: 'Client project milestone',
        memo_id: 1004,
        amount_credit: '800.00',
        budget_category: 'Income'
      },
      {
        id: 105,
        transaction_number: 'TX-2025-005',
        date: '2025-02-15',
        description: 'Support Contract',
        memo: 'Quarterly support',
        memo_id: 1005,
        amount_debit: '350.00',
        budget_category: 'Services'
      },
      {
        id: 106,
        transaction_number: 'TX-2025-006',
        date: '2025-02-28',
        description: 'Training Session',
        memo: 'Staff training',
        memo_id: 1006,
        amount_debit: '350.00',
        budget_category: 'Training'
      }
    ]
  },
  {
    month: 'Mar',
    amount: 1200,
    transactions: [
      {
        id: 107,
        transaction_number: 'TX-2025-007',
        date: '2025-03-07',
        description: 'Software Upgrade',
        memo: 'System upgrade',
        memo_id: 1007,
        amount_debit: '500.00',
        budget_category: 'Software'
      },
      {
        id: 108,
        transaction_number: 'TX-2025-008',
        date: '2025-03-18',
        description: 'Maintenance Fee',
        memo: 'Regular maintenance',
        memo_id: 1008,
        amount_debit: '250.00',
        budget_category: 'Maintenance'
      },
      {
        id: 109,
        transaction_number: 'TX-2025-009',
        date: '2025-03-25',
        description: 'Consultation',
        memo: 'Expert consultation',
        memo_id: 1009,
        amount_debit: '450.00',
        budget_category: 'Services'
      }
    ]
  },
  {
    month: 'Apr',
    amount: 1800,
    transactions: [
      {
        id: 110,
        transaction_number: 'TX-2025-010',
        date: '2025-04-10',
        description: 'New Client Setup',
        memo: 'Client onboarding',
        memo_id: 1010,
        amount_credit: '1000.00',
        budget_category: 'Income'
      },
      {
        id: 111,
        transaction_number: 'TX-2025-011',
        date: '2025-04-22',
        description: 'Website Development',
        memo: 'Website redesign project',
        memo_id: 1011,
        amount_debit: '800.00',
        budget_category: 'Development'
      }
    ]
  },
  {
    month: 'May',
    amount: 2100,
    transactions: [
      {
        id: 112,
        transaction_number: 'TX-2025-012',
        date: '2025-05-03',
        description: 'Annual Contract',
        memo: 'Client annual renewal',
        memo_id: 1012,
        amount_credit: '1200.00',
        budget_category: 'Income'
      },
      {
        id: 113,
        transaction_number: 'TX-2025-013',
        date: '2025-05-14',
        description: 'Equipment Sale',
        memo: 'Hardware sale',
        memo_id: 1013,
        amount_credit: '450.00',
        budget_category: 'Equipment'
      },
      {
        id: 114,
        transaction_number: 'TX-2025-014',
        date: '2025-05-29',
        description: 'Support Renewal',
        memo: 'Support package renewal',
        memo_id: 1014,
        amount_debit: '450.00',
        budget_category: 'Support'
      }
    ]
  },
  {
    month: 'Jun',
    amount: 1600,
    transactions: [
      {
        id: 115,
        transaction_number: 'TX-2025-015',
        date: '2025-06-08',
        description: 'Consulting Project',
        memo: 'Client consulting',
        memo_id: 1015,
        amount_debit: '900.00',
        budget_category: 'Services'
      },
      {
        id: 116,
        transaction_number: 'TX-2025-016',
        date: '2025-06-17',
        description: 'Training Workshop',
        memo: 'Team workshop',
        memo_id: 1016,
        amount_debit: '700.00',
        budget_category: 'Training'
      }
    ]
  },
  {
    month: 'Jul',
    amount: 2200,
    transactions: [
      {
        id: 117,
        transaction_number: 'TX-2025-017',
        date: '2025-07-05',
        description: 'Software License',
        memo: 'New software purchase',
        memo_id: 1017,
        amount_debit: '850.00',
        budget_category: 'Software'
      },
      {
        id: 118,
        transaction_number: 'TX-2025-018',
        date: '2025-07-15',
        description: 'Equipment Upgrade',
        memo: 'Hardware upgrades',
        memo_id: 1018,
        amount_debit: '950.00',
        budget_category: 'Equipment'
      },
      {
        id: 119,
        transaction_number: 'TX-2025-019',
        date: '2025-07-28',
        description: 'Maintenance Contract',
        memo: 'Yearly maintenance',
        memo_id: 1019,
        amount_debit: '400.00',
        budget_category: 'Maintenance'
      }
    ]
  },
  {
    month: 'Aug',
    amount: 2500,
    transactions: [
      {
        id: 120,
        transaction_number: 'TX-2025-020',
        date: '2025-08-06',
        description: 'New Project',
        memo: 'Client project start',
        memo_id: 1020,
        amount_credit: '1200.00',
        budget_category: 'Income'
      },
      {
        id: 121,
        transaction_number: 'TX-2025-021',
        date: '2025-08-14',
        description: 'Consultation Services',
        memo: 'Expert consultation',
        memo_id: 1021,
        amount_debit: '700.00',
        budget_category: 'Services'
      },
      {
        id: 122,
        transaction_number: 'TX-2025-022',
        date: '2025-08-27',
        description: 'License Renewal',
        memo: 'Software license renewal',
        memo_id: 1022,
        amount_debit: '600.00',
        budget_category: 'Software'
      }
    ]
  },
  {
    month: 'Sep',
    amount: 2300,
    transactions: [
      {
        id: 123,
        transaction_number: 'TX-2025-023',
        date: '2025-09-05',
        description: 'Support Package',
        memo: 'Premium support',
        memo_id: 1023,
        amount_debit: '800.00',
        budget_category: 'Support'
      },
      {
        id: 124,
        transaction_number: 'TX-2025-024',
        date: '2025-09-19',
        description: 'Custom Development',
        memo: 'Custom software development',
        memo_id: 1024,
        amount_debit: '1500.00',
        budget_category: 'Development'
      }
    ]
  },
  {
    month: 'Oct',
    amount: 1900,
    transactions: [
      {
        id: 125,
        transaction_number: 'TX-2025-025',
        date: '2025-10-03',
        description: 'Quarterly Services',
        memo: 'Quarterly maintenance',
        memo_id: 1025,
        amount_debit: '900.00',
        budget_category: 'Services'
      },
      {
        id: 126,
        transaction_number: 'TX-2025-026',
        date: '2025-10-17',
        description: 'Software Upgrade',
        memo: 'Version upgrade',
        memo_id: 1026,
        amount_debit: '600.00',
        budget_category: 'Software'
      },
      {
        id: 127,
        transaction_number: 'TX-2025-027',
        date: '2025-10-28',
        description: 'Hardware Sale',
        memo: 'Server hardware',
        memo_id: 1027,
        amount_credit: '400.00',
        budget_category: 'Equipment'
      }
    ]
  },
  {
    month: 'Nov',
    amount: 2000,
    transactions: [
      {
        id: 128,
        transaction_number: 'TX-2025-028',
        date: '2025-11-08',
        description: 'Annual Maintenance',
        memo: 'System maintenance',
        memo_id: 1028,
        amount_debit: '850.00',
        budget_category: 'Maintenance'
      },
      {
        id: 129,
        transaction_number: 'TX-2025-029',
        date: '2025-11-21',
        description: 'Consulting Hours',
        memo: 'Professional services',
        memo_id: 1029,
        amount_debit: '1150.00',
        budget_category: 'Services'
      }
    ]
  },
  {
    month: 'Dec',
    amount: 2400,
    transactions: [
      {
        id: 130,
        transaction_number: 'TX-2025-030',
        date: '2025-12-05',
        description: 'Year-end Project',
        memo: 'Year-end implementation',
        memo_id: 1030,
        amount_debit: '1100.00',
        budget_category: 'Projects'
      },
      {
        id: 131,
        transaction_number: 'TX-2025-031',
        date: '2025-12-14',
        description: 'License Renewal',
        memo: 'Annual license renewal',
        memo_id: 1031,
        amount_debit: '750.00',
        budget_category: 'Software'
      },
      {
        id: 132,
        transaction_number: 'TX-2025-032',
        date: '2025-12-19',
        description: 'Support Extension',
        memo: 'Support package extension',
        memo_id: 1032,
        amount_debit: '550.00',
        budget_category: 'Support'
      }
    ]
  }
])

// CHART DIMENSIONS
const margin = { top: 30, right: 50, bottom: 70, left: 80 }
const width = ref(750 - margin.left - margin.right)
const height = ref(500 - margin.top - margin.bottom)

// MIN AND MAX FOR SLIDER
const minAmount = ref(0)
const maxAmount = ref(Math.ceil(Math.max(...data.value.map(d => d.amount)) * 1.2))
const thresholdValue = ref(1500)

// SVG CHART ELEMENTS
const svg = ref<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null)
const thresholdLine = ref<d3.Selection<SVGLineElement, unknown, null, undefined> | null>(null)
const xScale = ref<d3.ScaleBand<string> | null>(null)
const yScale = ref<d3.ScaleLinear<number, number> | null>(null)

const formatTooltip = (val: number) => {
  return `${val.toLocaleString()}`
}

const updateThresholdLine = () => {
  if (thresholdLine.value && yScale.value) {
    thresholdLine.value
      .attr('y1', yScale.value(thresholdValue.value))
      .attr('y2', yScale.value(thresholdValue.value))
  }
}

onMounted(() => {
  createBarChart(
    chartContainer,
    data,
    width,
    height,
    margin,
    maxAmount,
    thresholdValue,
    popoverVisible,
    popoverPosition,
    selectedMonth,
    svg,
    xScale,
    yScale,
    thresholdLine
  )
})

watch(thresholdValue, () => {
  updateThresholdLine()
})
</script>

<style scoped>
.chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
  position: relative;
}

.chart-slider-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}

.d3-chart {
  width: 750px;
  height: 500px;
}

.slider-container {
  margin-left: 30px;
  height: 400px;
  display: flex;
  align-items: center;
}

.custom-popover {
  position: absolute;
  z-index: 1000;
  transform: translate(-50%, -100%);
  margin-top: -10px;
}

.popover-card {
  max-width: 400px;
}

.card-header {
  font-weight: bold;
  color: #409EFF;
}

:deep(.bar) {
  cursor: pointer;
  transition: fill 0.2s;
}
</style>