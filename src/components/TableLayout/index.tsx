import { ref, defineComponent, computed, PropType } from 'vue';
import CommonForm, { CommonFormItem } from '../CommonForm/index';
import './index.less';
import Tool from './Tool';

// 分页接口返回值
export interface PaginationResponse<T> {
  current: number;
  pageSize: number;
  total: number;
  records: T[];
}

export type TableSearchFun = (
  data: Common.PaginationParams
) => Promise<PaginationResponse<Common.TreeNode>>;
export default defineComponent({
  components: {},
  props: {
    /**
     * 表格头部按钮组
     */
    buttons: {
      type: Array,
      default: () => [],
    },
    /**
     * 搜索栏
     */
    formJson: {
      type: Array as PropType<CommonFormItem[]>,
      default: () => [],
    },
    /**
     * 表格列配置
     */
    columns: {
      type: Array as PropType<Common.TableColumns[]>,
      default: () => [],
    },
    /**
     * 搜索回调
     */
    search: {
      type: Function as PropType<TableSearchFun>,
      default: () => () => {},
    },
    rowKey: {
      type: String,
      default: 'id',
    },
  },
  setup(props) {
    // 分页
    const current = ref(1);
    const pageSize = ref(10);
    const total = ref(0);
    const loading = ref(false);

    const formData = ref({});
    const tableData = ref<Common.TreeNode[]>([]);
    const selectedRowKeys = ref<Common.OptionValue[]>([]);
    const handleTableRowChange = function (
      newSelectedRowKeys: Common.OptionValue[]
    ) {
      selectedRowKeys.value = [...newSelectedRowKeys];
    };
    const rowSelection = {
      columnWidth: 20,
      onChange: handleTableRowChange,
    };

    const handleSearch = function () {
      loading.value = true;
      const params = {
        ...formData.value,
      };
      props
        .search({
          params,
          pageNum: current.value,
          pageSize: pageSize.value,
        })
        .then((res: PaginationResponse<Common.TreeNode>) => {
          tableData.value = res.records.map((item) => item);
          current.value = res.current;
          pageSize.value = res.pageSize;
          total.value = res.total;
          loading.value = false;
        });
    };
    const handleReset = function () {
      formData.value = {};
    };

    const getFormJson = computed(() => {
      let formJson: CommonFormItem[] = props.formJson;
      if (formJson.length > 0) {
        formJson = [
          ...formJson,
          {
            fieldName: '查询',
            type: 'button',
            label: '查询',
            extraConfig: {
              type: 'primary',
              onClick: handleSearch,
            },
          },
          {
            fieldName: '重置',
            type: 'button',
            label: '重置',
            extraConfig: {
              onClick: handleReset,
            },
          },
        ];
      }
      return formJson;
    });

    return {
      current,
      pageSize,
      total,
      loading,
      formData,
      tableData,
      rowSelection,
      selectedRowKeys,
      getFormJson,
      handleSearch,
      handleReset,
    };
  },
  data() {
    return {};
  },
  created() {
    this.handleSearch();
  },
  methods: {
    resetSearch() {
      this.current = 1;
      this.handleSearch();
    },
    handleChange(page: number) {
      this.current = page;
      this.handleSearch();
    },
  },
  render() {
    const {
      buttons,
      formData,
      getFormJson,
      loading,
      columns,
      tableData,
      total,
      current,
      pageSize,
      rowSelection,
      selectedRowKeys,
      $slots = {},
      rowKey,
      handleChange,
    } = this;
    const { formBottom = () => {} } = $slots;
    console.log(tableData);
    return (
      <div class="table-layout">
        <CommonForm
          class="common-form"
          ref="commonFormRef"
          formData={formData}
          formJson={getFormJson}
        />
        {formBottom()}
        <div class="table-layout-table">
          <Tool
            buttons={buttons}
            selectedRowKeys={selectedRowKeys}
            tableData={tableData}
            rowKey={rowKey}
          />
          <a-table
            tableLayout="fixed"
            loading={loading}
            row-selection={rowSelection}
            columns={columns}
            data-source={tableData}
            rowKey={rowKey}
            pagination={{ total, current, pageSize, onChange: handleChange }}
          ></a-table>
        </div>
      </div>
    );
  },
});
