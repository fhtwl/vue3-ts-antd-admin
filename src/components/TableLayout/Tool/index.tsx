import './index.less';
import { defineComponent, PropType } from 'vue';

export interface VueComponentNode {
  data: { attrs: { action: string } };
  props: {
    action: string;
    onClick: (
      e: FormDataEvent,
      selectedRowKeys?: Common.OptionValue[],
      selectNodes?: Common.TreeNode[]
    ) => unknown;
  };
}

export interface ToolButton<K, N> {
  key?: string;
  onClick?: (selectedRowKeys: K[], selectNodes: N[]) => void; // 点击回调
  action?: string; // 操作类型
  vAction?: string; // 操作权限
  icon?: Common.RenderElement; // 图标
  text?: string; // 文字
  render?: (node: ToolButton<K, N>) => Common.RenderElement;
}

export default defineComponent({
  props: {
    list: {
      type: Array as PropType<VueComponentNode[]>,
      default: () => [],
    },
    buttons: {
      type: Array,
      default: () => [],
    },
    selectedRowKeys: {
      type: Array as PropType<Common.OptionValue[]>,
      default: () => [],
    },
    tableData: {
      type: Array as PropType<Common.TreeNode[]>,
      default: () => [],
    },
    rowKey: {
      type: [String],
      default: 'id',
    },
  },
  data() {
    return {};
  },
  computed: {},

  created() {},
  methods: {},
  render() {
    const { buttons, rowKey } = this;
    return (
      <div class="table-layout-header">
        {buttons.map((item) => {
          const {
            action = '',
            vAction,
            onClick = () => {},
            key,
            icon,
            text,
            render,
          } = item as unknown as ToolButton<Common.OptionValue, Common.Params>;

          if (render) {
            return render(
              item as unknown as ToolButton<Common.OptionValue, Common.Params>
            );
          } else {
            const handleClick = () => {
              const { selectedRowKeys, tableData } = this;
              const config = {
                single: ['query', 'edit', 're-name', 'move'], // 只能选1个
                many: ['delete'], // 多选
              };
              if (config.single.includes(action)) {
                if (selectedRowKeys.length === 0) {
                  this.$message.warn('请先选择');
                  return;
                } else if (selectedRowKeys.length > 1) {
                  this.$message.warn('只能选择1个');
                  return;
                }
              } else if (config.many.includes(action)) {
                if (selectedRowKeys.length === 0) {
                  this.$message.warn('请先选择');
                  return;
                }
              }
              const selectNodes: Common.TreeNode[] = [];
              const filter = (tree: Common.TreeNode[]) => {
                selectNodes.push(
                  ...tree.filter((row) =>
                    selectedRowKeys.includes(row[rowKey] as Common.OptionValue)
                  )
                );
                tree.forEach((item) => {
                  if (item.children) {
                    filter(item.children);
                  }
                });
              };
              filter(tableData);
              return onClick(selectedRowKeys, selectNodes);
            };
            return (
              <a-button key={key} onClick={handleClick} v-action={vAction}>
                {typeof icon === 'string' ? <c-icon type={icon} /> : icon}
                {text}
              </a-button>
            );
          }
        })}
      </div>
    );
  },
});
