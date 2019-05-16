import { Component, Vue, Prop, Model } from 'vue-property-decorator';
import { CreateElement, VNode } from 'vue';
import {
  FormItem,
  Col,
  DatePicker,
  Slider,
  Switch,
  Checkbox,
  Rate,
  RadioGroup,
  Radio,
  TimeSelect,
  InputNumber,
  Input,
  Select,
} from 'element-ui/types';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
type OmitVueProp<T> = Partial<Omit<T, keyof Vue>>;

type DefineItemCommon = {
  /**
   * type 为 el-select 时有效
   */
  options?: { label: string; value?: any; disabled?: true | false }[];
  /**
   * 父级索引, 选项跟随父组件的值变化，当做级联选择时非常有用
   */
  parentIndex?: number;
  /**
   * 以下三项在动态构建 option 菜单时需要
   */
  optionsKeyName?: string;
  lableKeyName?: string;
  valueKeyName?: string;
  /**
   * el-form-item 属性透传 优先级高于组件属性中定义的 通用 formItemProps
   */
  formItemProps?: OmitVueProp<FormItem>;
  /**
   * el-col 属性透传 优先级高于组件属性中定义的 通用 colProps
   */
  colProps?: OmitVueProp<Col>;
  /**
   * el-form-item 的 label属性提升
   */
  label?: string;
};

type DefineInput = { type: 'el-input'; props?: OmitVueProp<Input> & { clearable?: boolean } };
type DefineSelect = { type: 'el-select'; props?: OmitVueProp<Select> } & { multiple?: boolean };
type DefineDatePicker = { type: 'el-date-picker'; props?: OmitVueProp<DatePicker> };
type DefineTimeSelect = { type: 'el-time-select'; props?: OmitVueProp<TimeSelect> };
type DefineInputNumber = { type: 'el-input-number'; props?: OmitVueProp<InputNumber> };
type DefineRadio = { type: 'el-radio'; props?: OmitVueProp<Radio> };
type DefineRadioGroup = { type: 'el-radio-group'; props?: OmitVueProp<RadioGroup> };
type DefineRate = { type: 'el-rate'; props?: OmitVueProp<Rate> };
type DefineCheckbox = { type: 'el-checkbox'; props?: OmitVueProp<Checkbox> };
type DefineSwitch = { type: 'el-switch'; props?: OmitVueProp<Switch> };
type DefineSlider = { type: 'el-slider'; props?: OmitVueProp<Slider> };

export type DefineItem = (
  | DefineInput
  | DefineSelect
  | DefineDatePicker
  | DefineTimeSelect
  | DefineInputNumber
  | DefineRadio
  | DefineRadioGroup
  | DefineRate
  | DefineCheckbox
  | DefineSwitch
  | DefineSlider) &
  DefineItemCommon;
export type DefineItemFn = (vm: ComposeInput, index: number) => DefineItem;

export type ColProps = OmitVueProp<Col>;
export type FormItemProps = OmitVueProp<FormItem>;

const RadioGroupHoc = {
  functional: true,
  render(h: CreateElement, { data, props }) {
    const { options = [], type = '' } = props;
    let elTag = !!type && type === 'button' ? 'el-radio-button' : 'el-radio';
    const children = (options as string[]).map(it => h(elTag, { props: { label: it } })) || [];
    return h('el-radio-group', data, children);
  },
};

@Component({
  name: 'ComposeInput',
  components: { RadioGroupHoc },
})
export default class ComposeInput extends Vue {
  /**
   * 组件结构定义
   */
  @Prop({ required: true, type: Array })
  define!: DefineItem[];

  /**
   * 动态构建 el-options 的数据源
   */
  @Prop({ type: Array })
  dataSource?: { [key: string]: any }[];

  /**
   * 列宽控制
   */
  @Prop({ required: false })
  span?: number;

  /**
   * 栅格间距
   */
  @Prop({ type: Number, default: 16 })
  gutter?: number;

  /**
   * 是否使用 el-form-item包装动态表单组件 默认为使用
   * 用法：no-form-item
   */
  @Prop({ type: Boolean, default: false })
  noFormItem?: boolean;

  /**
   * 通用 el-form-item 属性
   */
  @Prop({ type: Object })
  formItemProps?: { [key: string]: any };

  /**
   * 通用 el-col 属性
   */
  @Prop({ type: Object })
  colProps?: { [key: string]: any };

  @Model('input')
  value!: any[];

  get computedSpan() {
    let len = this.define.length;
    if (Number.isInteger(this.span)) {
      return this.define.map(() => this.span);
    }
    if (Array.isArray(this.span) && this.span.length) {
      return this.span;
    }
    let mods = 24 % len;
    return this.define.map((_, index) => {
      if (index === len - 1) {
        return mods > 0 ? mods : 24 / len;
      }
      return 24 / len;
    });
  }

  /** options for el-select  */
  getOptions(item: DefineItem, index: number): any[] {
    if (item.options) return item.options;
    const { parentIndex, optionsKeyName, lableKeyName, valueKeyName } = item;

    if (Number.isInteger(parentIndex)) {
      // 如果父级未选则返回空数组
      if (!this.value[parentIndex]) return [];

      const parentDefine = this.define[parentIndex];
      const parentValue = this.value[parentIndex];
      const parentValueKeyName = parentDefine.valueKeyName;
      const parentData = this.dataSource.find(it => it[parentValueKeyName] === parentValue);

      if (!Array.isArray(parentData[optionsKeyName])) {
        return [];
      }
      return parentData[optionsKeyName].map(it => ({
        label: it[lableKeyName],
        value: it[valueKeyName],
      }));
    }
    return this.dataSource.map(it => ({
      label: it[lableKeyName],
      value: it[valueKeyName],
    }));
  }

  mapToOptions(arr: string[]) {
    return arr.map(it => ({ label: it, value: it }));
  }

  genCol() {
    const { $createElement, define, computedSpan, genElement, noFormItem, genFormItem } = this;
    return define.map((item, index) => {
      const span = computedSpan[index];
      const props = { span, ...this.colProps, ...item.colProps };
      return !noFormItem
        ? $createElement('el-col', { props }, [genFormItem(item, index)])
        : $createElement('el-col', { props }, [genElement(item, index)]);
    });
  }

  genFormItem(item: DefineItem, index: number) {
    const { $createElement, genElement, formItemProps } = this;
    const { label } = item;
    const props = { formItemProps, label, ...item.formItemProps };
    return $createElement('el-form-item', { props }, [genElement(item, index)]);
  }

  genElement(item: DefineItem | DefineItemFn, index: number): VNode {
    let _item = item as DefineItem;
    // 如果item是函数则调用函数
    if (typeof item === 'function') {
      _item = item(this, index);
    }

    const children = [];

    if (_item.type === 'el-select') {
      this.getOptions(_item, index).forEach(op => {
        const elOption = this.$createElement('el-option', {
          props: { label: op.label, value: op.value },
          key: op.value,
        });
        children.push(elOption);
      });

      // 如果是多选判断值是否为数组
      if (_item.props && _item.props.multiple) {
        !Array.isArray(this.value[index]) && (this.value[index] = []);
      }
    }

    const self = this;
    // const style = _item.props && _item.props.style ? _item.props.style : { minWidth: '60px', width: '100%' };
    const style = { minWidth: '60px', width: '100%' };

    const data = {
      style,
      props: {
        ..._item.props,
        value: this.value[index],
      },
      on: {
        input(val) {
          if (['el-input-number', 'el-slider', 'el-select'].includes(_item.type)) {
            return;
          }

          console.log('==== input ====> ', _item.type, val);
          self.value[index] = val;
          self.$emit('input', self.value);
          self.$forceUpdate();
        },
        change(val) {
          if (['el-time-select', 'el-date-picker', 'el-input'].includes(_item.type)) return;
          console.log('==== change ====> ', _item.type, val);
          self.value[index] = val;
          self.$emit('input', self.value);
          self.$forceUpdate();
        },
      },
    };
    return this.$createElement(_item.type, data, children);
  }

  render(h: CreateElement) {
    console.log('==ComposeInput=>  render');
    const gutter = this.gutter;
    const type = 'flex';
    return h(
      'el-row',
      {
        // flex模式下自动换行
        style: { flexWrap: 'wrap' },
        props: { gutter, type },
      },
      this.genCol()
    );
  }
}
