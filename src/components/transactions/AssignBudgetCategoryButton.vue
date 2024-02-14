<template>
  <el-button type="primary" @click="assignBudgetCategory" data-testid="assign-budget-category-button">
    Assign Budget Category
  </el-button>
  <div v-if="error">
    <el-alert
        title="Error"
        type="error"
        :closable="false"
        :show-icon="true"
        :center="true"
    >
      {{ error.message }}
    </el-alert>
    <el-button type="danger" @click="reset">
      Reset
    </el-button>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";
import {useMutation} from "@tanstack/vue-query"
import {updateMemo} from "@api/transactions/updateMemo";
import {useTransactionsStore} from "@stores/transactions";

export default defineComponent({
  name: "AssignBudgetCategoryButton",
  setup() {

    const store = useTransactionsStore();

    const selectedMemo = computed(() => store.getSelectedMemo);
    const selectedBudgetCategory = computed(() => store.getSelectedBudgetCategory);

    const {error, mutate, reset} = useMutation({
      mutationFn: ({memo, budgetCategory}: {
        memo: string,
        budgetCategory: string
      }) => updateMemo(memo, budgetCategory),
    })

    function assignBudgetCategory() {
      mutate({
        memo: selectedMemo.value,
        budgetCategory: selectedBudgetCategory.value
      });
    }

    return {assignBudgetCategory, error, reset};

  }
})


</script>

<style scoped>

</style>