export default {
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    define: { required: true, type: Array },
    dataSource: { type: Array },
    span: { required: false },
    gutter: { type: Number, default: 16 },
    noFormItem: { type: Boolean, default: false },
    formItemProps: { type: Object },
    colProps: { type: Object },
    value: { type: Array }
  },
  computed: {
    computedSpan() {
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
  },
  methods: {
    /** options for el-select  */
    getOptions(item, index) {
      if (item.options) return item.options;
      const { parentIndex, optionsKeyName, lableKeyName, valueKeyName } = item;

      if (Number.isInteger(parentIndex)) {
        // 如果父级未选则返回空数组
        if (!this.value[parentIndex]) return [];

        const parentDefine = this.define[parentIndex];
        const parentValue = this.value[parentIndex];
        const parentValueKeyName = parentDefine.valueKeyName;
        const parentData = this.dataSource.find(it => it[parentValueKeyName] === parentValue);
        // 如果指定的 optionsKeyName 不是数组，则返回空数组
        if (!Array.isArray(parentData[optionsKeyName])) {
          return [];
        }
        // 如果指定了 lableKeyName 和 valueKeyName
        if (lableKeyName && valueKeyName) {
          return parentData[optionsKeyName].map(it => ({
            label: it[lableKeyName],
            value: it[valueKeyName]
          }));
        } else {
          return parentData[optionsKeyName];
        }
      }
      return this.dataSource.map(it => ({
        label: it[lableKeyName],
        value: it[valueKeyName]
      }));
    },

    mapToOptions(arr /** @type string[] */) {
      return arr.map(it => ({ label: it, value: it }));
    },

    genCol() {
      const { $createElement, define, computedSpan, genElement, noFormItem, genFormItem } = this;
      return define.map((item, index) => {
        const span = computedSpan[index];
        const props = { span, ...this.colProps, ...item.colProps };
        return !noFormItem
          ? $createElement('el-col', { props }, [genFormItem(item, index)])
          : $createElement('el-col', { props }, [genElement(item, index)]);
      });
    },

    genFormItem(item, index) {
      const { $createElement, genElement, formItemProps } = this;
      const { label } = item;
      const props = { formItemProps, label, ...item.formItemProps };
      return $createElement('el-form-item', { props }, [genElement(item, index)]);
    },

    genElement(item, index) {
      let _item = item;
      // 如果item是函数则调用函数
      if (typeof item === 'function') {
        _item = item(this, index);
      }

      const children = [];

      if (_item.type === 'el-select') {
        this.getOptions(_item, index).forEach(op => {
          const elOption = this.$createElement('el-option', {
            props: { label: op.label, value: op.value },
            key: op.value
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
          value: this.value[index]
        },
        on: {
          input(val) {
            if (['el-input-number', 'el-slider', 'el-select'].includes(_item.type)) {
              return;
            }
            self.value[index] = val;
            self.$emit('input', self.value);
            self.$forceUpdate();
          },
          change(val) {
            if (['el-time-select', 'el-date-picker', 'el-input'].includes(_item.type)) return;
            self.value[index] = val;
            self.$emit('input', self.value);
            self.$forceUpdate();
          }
        }
      };
      return this.$createElement(_item.type, data, children);
    }
  },
  render(h) {
    const gutter = this.gutter;
    const type = 'flex';
    return h(
      'el-row',
      {
        // flex模式下自动换行
        style: { flexWrap: 'wrap' },
        props: { gutter, type }
      },
      this.genCol()
    );
  }
};
