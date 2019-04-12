import Vue from 'vue';
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

declare type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
declare type OmitVueProp<T> = Partial<Omit<T, keyof Vue>>;
declare type DefineItemCommon = {
  /**
   * type 为 el-select 时有效
   */
  options?: {
    label: string;
    value?: any;
    disabled?: true | false;
  }[];
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
declare type DefineInput = {
  type: 'el-input';
  props?: OmitVueProp<Input> & {
    clearable?: boolean;
  };
};
declare type DefineSelect = {
  type: 'el-select';
  props?: OmitVueProp<Select> & {
    multiple?: boolean;
  };
};
declare type DefineDatePicker = {
  type: 'el-date-picker';
  props?: OmitVueProp<DatePicker>;
};
declare type DefineTimeSelect = {
  type: 'el-time-select';
  props?: OmitVueProp<TimeSelect>;
};
declare type DefineInputNumber = {
  type: 'el-input-number';
  props?: OmitVueProp<InputNumber>;
};
declare type DefineRadio = {
  type: 'el-radio';
  props?: OmitVueProp<Radio>;
};
declare type DefineRadioGroup = {
  type: 'el-radio-group';
  props?: OmitVueProp<RadioGroup>;
};
declare type DefineRate = {
  type: 'el-rate';
  props?: OmitVueProp<Rate>;
};
declare type DefineCheckbox = {
  type: 'el-checkbox';
  props?: OmitVueProp<Checkbox>;
};
declare type DefineSwitch = {
  type: 'el-switch';
  props?: OmitVueProp<Switch>;
};
declare type DefineSlider = {
  type: 'el-slider';
  props?: OmitVueProp<Slider>;
};
export declare type DefineItem = (
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
export declare type DefineItemFn = (vm: ComposeInput, index: number) => DefineItem;
export default class ComposeInput extends Vue {
  define: DefineItem[];
  dataSource?: {
    [key: string]: any;
  }[];
  /**
   * 列宽 el-col 的 span 属性, 如果没有指定将根据 define 的元素个数来计算
   */
  span?: number;
  /**
   * 栅格间距 el-row 的 gutter 属性 默认 16
   */
  gutter?: number;
  /**
   * 是否使用 el-form-item包装动态表单组件 默认为使用
   * 用法：no-form-item
   */
  noFormItem?: boolean;
  /**
   * 通用 el-form-item 属性
   */
  formItemProps?: {
    [key: string]: any;
  };
  /**
   * 通用 el-col 属性
   */
  colProps?: {
    [key: string]: any;
  };
  value: any[];
}
