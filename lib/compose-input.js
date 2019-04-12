var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
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
            computedSpan: function () {
                var _this = this;
                var len = this.define.length;
                if (Number.isInteger(this.span)) {
                    return this.define.map(function () { return _this.span; });
                }
                if (Array.isArray(this.span) && this.span.length) {
                    return this.span;
                }
                var mods = 24 % len;
                return this.define.map(function (_, index) {
                    if (index === len - 1) {
                        return mods > 0 ? mods : 24 / len;
                    }
                    return 24 / len;
                });
            }
        },
        methods: {
            /** options for el-select  */
            getOptions: function (item, index) {
                if (item.options)
                    return item.options;
                var parentIndex = item.parentIndex, optionsKeyName = item.optionsKeyName, lableKeyName = item.lableKeyName, valueKeyName = item.valueKeyName;
                if (Number.isInteger(parentIndex)) {
                    // 如果父级未选则返回空数组
                    if (!this.value[parentIndex])
                        return [];
                    var parentDefine = this.define[parentIndex];
                    var parentValue_1 = this.value[parentIndex];
                    var parentValueKeyName_1 = parentDefine.valueKeyName;
                    var parentData = this.dataSource.find(function (it) { return it[parentValueKeyName_1] === parentValue_1; });
                    // 如果指定的 optionsKeyName 不是数组，则返回空数组
                    if (!Array.isArray(parentData[optionsKeyName])) {
                        return [];
                    }
                    // 如果指定了 lableKeyName 和 valueKeyName
                    if (lableKeyName && valueKeyName) {
                        return parentData[optionsKeyName].map(function (it) { return ({
                            label: it[lableKeyName],
                            value: it[valueKeyName]
                        }); });
                    }
                    else {
                        return parentData[optionsKeyName];
                    }
                }
                return this.dataSource.map(function (it) { return ({
                    label: it[lableKeyName],
                    value: it[valueKeyName]
                }); });
            },
            mapToOptions: function (arr /** @type string[] */) {
                return arr.map(function (it) { return ({ label: it, value: it }); });
            },
            genCol: function () {
                var _this = this;
                var _a = this, $createElement = _a.$createElement, define = _a.define, computedSpan = _a.computedSpan, genElement = _a.genElement, noFormItem = _a.noFormItem, genFormItem = _a.genFormItem;
                return define.map(function (item, index) {
                    var span = computedSpan[index];
                    var props = __assign({ span: span }, _this.colProps, item.colProps);
                    return !noFormItem
                        ? $createElement('el-col', { props: props }, [genFormItem(item, index)])
                        : $createElement('el-col', { props: props }, [genElement(item, index)]);
                });
            },
            genFormItem: function (item, index) {
                var _a = this, $createElement = _a.$createElement, genElement = _a.genElement, formItemProps = _a.formItemProps;
                var label = item.label;
                var props = __assign({ formItemProps: formItemProps, label: label }, item.formItemProps);
                return $createElement('el-form-item', { props: props }, [genElement(item, index)]);
            },
            genElement: function (item, index) {
                var _this = this;
                var _item = item;
                // 如果item是函数则调用函数
                if (typeof item === 'function') {
                    _item = item(this, index);
                }
                var children = [];
                if (_item.type === 'el-select') {
                    this.getOptions(_item, index).forEach(function (op) {
                        var elOption = _this.$createElement('el-option', {
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
                var self = this;
                // const style = _item.props && _item.props.style ? _item.props.style : { minWidth: '60px', width: '100%' };
                var style = { minWidth: '60px', width: '100%' };
                var data = {
                    style: style,
                    props: __assign({}, _item.props, { value: this.value[index] }),
                    on: {
                        input: function (val) {
                            if (['el-input-number', 'el-slider', 'el-select'].includes(_item.type)) {
                                return;
                            }
                            self.value[index] = val;
                            self.$emit('input', self.value);
                            self.$forceUpdate();
                        },
                        change: function (val) {
                            if (['el-time-select', 'el-date-picker', 'el-input'].includes(_item.type))
                                return;
                            self.value[index] = val;
                            self.$emit('input', self.value);
                            self.$forceUpdate();
                        }
                    }
                };
                return this.$createElement(_item.type, data, children);
            }
        },
        render: function (h) {
            var gutter = this.gutter;
            var type = 'flex';
            return h('el-row', {
                // flex模式下自动换行
                style: { flexWrap: 'wrap' },
                props: { gutter: gutter, type: type }
            }, this.genCol());
        }
    };
});
//# sourceMappingURL=compose-input.js.map