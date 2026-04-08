<template>
  <div class="bv-dashboard">
    <div class="bv-summary-cards">
      <el-card class="bv-stat-card" shadow="never">
        <el-statistic title="Total Balance" :value="0" prefix="$" :precision="2" />
      </el-card>
      <el-card class="bv-stat-card" shadow="never">
        <el-statistic title="Monthly Spending" :value="0" prefix="$" :precision="2" />
      </el-card>
      <el-card class="bv-stat-card" shadow="never">
        <el-statistic title="Active Memos" :value="0" />
      </el-card>
    </div>

    <el-card class="bv-welcome-card" shadow="never">
      <h3 class="bv-welcome-title">Welcome to Budget Manager</h3>
      <p class="bv-welcome-desc">
        Use the sidebar to navigate between your transactions, memos, budgets, and debt tools.
      </p>
    </el-card>
  </div>
</template>

<style scoped>
.bv-dashboard {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.bv-summary-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.bv-stat-card {
  --el-card-border-color: var(--bv-border);
  --el-card-bg-color: var(--bv-panel-bg);
  border-radius: var(--bv-radius);
}

.bv-stat-card :deep(.el-statistic__head) {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--bv-sidebar-muted);
}

.bv-stat-card :deep(.el-statistic__content) {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--app-text-color);
}

.bv-welcome-card {
  --el-card-border-color: var(--bv-border);
  --el-card-bg-color: var(--bv-panel-bg);
  border-radius: var(--bv-radius);
}

.bv-welcome-title {
  margin: 0 0 0.5rem;
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--app-text-color);
}

.bv-welcome-desc {
  margin: 0;
  font-size: 0.875rem;
  color: var(--bv-sidebar-muted);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .bv-summary-cards {
    grid-template-columns: 1fr;
  }
}
</style>
