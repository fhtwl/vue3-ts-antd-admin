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

export default defineComponent({
  props: {
    list: {
      type: Array as PropType<VueComponentNode[]>,
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
    const { list, rowKey } = this;
    return (
      <div class="table-layout-header">
        {list.map((item: VueComponentNode) => {
          const { action, onClick } = item.props;
          console.log(item);
          const handleClick = Object.assign(onClick);
          item.props.onClick = () => {
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
            console.log(selectedRowKeys, tableData);
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
            return handleClick(selectedRowKeys, selectNodes);
          };
          return item;
        })}
      </div>
    );
  },
});
