<template>
  <el-calendar />
</template>

<script lang="ts">
import {defineComponent, ref, PropType, watchEffect, h} from "vue";
import {ElTag} from "element-plus";

const CalendarComponent = defineComponent({
  name: "CalendarComponent",
  props: {
    memosByDate: {
      type: Object as PropType<Record<string, { memo: string; amount: number }[]>>,
      default: () => ({}),
    },
  },
  setup(props) {
    const value = ref(new Date());
    const memosByDateRef = ref(props.memosByDate);

    const renderCell = ({ date }: { date: Date; isSelected: boolean }) => {
      const dateString = date.toLocaleDateString();
      const memos = memosByDateRef.value[dateString] || [];
      const memoTags = memos.map((memo) => {
        return h(ElTag, { type: 'info', closable: true }, `${memo.memo} (${memo.amount})`);
      });

      return h('div', { class: 'cell' }, [
        h('div', { class: 'day' }, date.getDate()),
        h('div', { class: 'memos' }, memoTags),
      ]);
    };

    watchEffect(() => {
      console.log('memosByDate:', props.memosByDate);
    });

    return { value, renderCell };
  }
});
export default CalendarComponent;
</script>

<style scoped>
.cell {
  position: relative;
  height: 120px;
  box-sizing: border-box;
  padding: 10px;
}

.day {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 18px;
}

.memos {
  position: absolute;
  bottom: 10px;
  left: 10px;
}
</style>
