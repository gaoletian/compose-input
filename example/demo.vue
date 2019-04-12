<template>
  <div>
    <h1>用法</h1>
    <compose-input v-model="oneValue" :define="oneDefine"></compose-input>
    <h1>级联选择</h1>
    <compose-input v-model="threeValue" :define="threeDefine" :data-source="threeDataSource"></compose-input>
    <h1>动态组合</h1>
    <compose-input v-model="twoValue" :define="twoDefine"></compose-input>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model } from 'vue-property-decorator';
import ComposeInput, { DefineItem, DefineItemFn } from '../';

const mapToOptions = (arr: string[]) => arr.map(it => ({ label: it, value: it }));
@Component({
  components: { ComposeInput },
})
export default class Demo extends Vue {
  // one
  oneValues = [];
  oneDefine: DefineItem[] = [
    { type: 'el-input' },
    { type: 'el-select' },
    { type: 'el-slider' },
    { type: 'el-date-picker' },
    { type: 'el-time-select' },
    { type: 'el-input-number' },
    { type: 'el-radio' },
    { type: 'el-rate' },
    { type: 'el-checkbox' },
    { type: 'el-switch' },
  ];
  // two 显示 label 属性透传
  twoValues = [];
  twoDefine: DefineItem[] = [
    { type: 'el-input', label: '用户名', props: { placeholder: '请输出用户名' } },
    { type: 'el-input', label: '密码', props: { placeholder: '请输入密码' } },
  ];
  // three 级联
  threeValues = [];
  threeDefine: [DefineItem, DefineItem, DefineItem] = [
    { type: 'el-select', lableKeyName: 'strategyName', valueKeyName: 'id' },
    {
      type: 'el-select',
      // 级联配置
      parentIndex: 0,
      optionsKeyName: 'strategyOperation',
      lableKeyName: 'name',
      valueKeyName: 'id',
    },
    {
      type: 'el-select',
      // 级联配置
      parentIndex: 0,
      optionsKeyName: 'strategyValues',
      lableKeyName: 'name',
      valueKeyName: 'id',
    },
  ];
  // 数据从api获取 此处为 mock 数据
  threeDataSource = [
    {
      id: '1',
      strategyName: '网站名称',
      strategyOperation: [{ name: '等于', id: '=' }],
      strategyValues: [{ name: '百度', id: '1' }, { name: '新浪', id: '2' }, { name: '阿里', id: '3' }],
    },
    {
      id: '2',
      strategyName: '访问量',
      strategyOperation: [{ name: '大于', id: '>' }, { name: '等于', id: '=' }, { name: '小于', id: '<' }],
      strategyValues: [{ name: '10', id: '10' }, { name: '100', id: '100' }],
    },
  ];
}
</script>

