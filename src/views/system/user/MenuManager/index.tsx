import { defineComponent } from 'vue';
import TableLayout from '@/components/TableLayout';
import { getMenuList, deleteMenuByIds } from '@/api/system/menu';
import './index.less';
import AddMenu from './AddMenu';
import { Fun } from '@fhtwl-admin/common';
import { VueComponentNode } from '@/components/TableLayout/Tool';
import { CommonFormItem } from '@/components/CommonForm';

export default defineComponent({
  setup() {},
  data() {
    return {
      formData: {
        name: '',
      },
      formJson: [
        {
          type: 'input',
          label: '名称',
          fieldName: 'name',
          extraConfig: {
            // className: "row",
          },
          dataType: String,
        },
      ] as CommonFormItem[],
      list: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      parentId: 0,
      tableLoading: true,
      columns: [
        {
          title: '名称',
          dataIndex: 'name',
          width: 120,
        },
        // {
        //   title: '图标',
        //   dataIndex: 'icon',
        //   width: 40,
        //   customRender: (text, record, index) => {
        //     return (
        //       <div>
        //         <c-icon style="font-size: 20px" type={text} />
        //       </div>
        //     )
        //   }
        // },
        {
          title: '排序',
          dataIndex: 'serialNum',
          width: 40,
        },
        {
          title: '权限标识',
          dataIndex: 'permission',
          width: 90,
        },
        {
          title: '是否显示',
          dataIndex: 'show',
          width: 60,
          customRender: (text: boolean) => {
            return text ? '是' : '否';
          },
        },
        {
          title: '更新时间',
          dataIndex: 'updatedAt',
          width: 80,
        },
      ],
      tableHeader: [
        <a-button
          key="approve-add"
          onClick={this.handleAddClick}
          action="add"
          v-action="system:menu:add"
        >
          <c-icon type="add" />
          新增
        </a-button>,
        <a-button
          key="approve-delete"
          onClick={this.handleDeleteClick}
          action="delete"
          v-action="system:menu:delete"
        >
          <c-icon type="delete" />
          删除
        </a-button>,
        <a-button
          key="approve-edit"
          onClick={this.handleEditClick}
          action="edit"
          v-action="system:menu:edit"
        >
          <c-icon type="move" />
          编辑
        </a-button>,
        <a-button
          key="approve-query"
          onClick={this.handleDetailsClick}
          action="query"
          v-action="system:menu:query"
        >
          <c-icon type="details" />
          预览
        </a-button>,
      ],
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    handleSearch(data: Common.PaginationParams, resolve: Fun) {
      getMenuList({ ...data }).then(resolve);
    },
    handleAddClick() {
      (this.$refs.addMenuRef as { show: Fun }).show('add', {});
    },
    handleEditClick(_selectKey: unknown, selectNodes: number[]) {
      (this.$refs.addMenuRef as { show: Fun }).show('edit', selectNodes[0]);
    },
    handleDeleteClick(_selectKey: unknown, selectNodes: Common.TreeNode[]) {
      this.$confirm({
        title: '是否确认删除',
        content: '删除该菜单会删除该菜单的所有子菜单',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        maskClosable: false,
        onOk: () => {
          const ids: number[] = [];
          const each = (tree: Common.TreeNode[]) => {
            tree.forEach((item) => {
              ids.push(item.id);
              if (item.children) {
                each(item.children);
              }
            });
          };
          each(selectNodes);
          deleteMenuByIds({
            ids: ids.join(','),
          }).then(() => {
            this.$message.success('删除成功');
            this.reSearch();
          });
        },
      });
    },
    handleDetailsClick(_selectKey: unknown, selectNodes: number[]) {
      console.log(_selectKey, selectNodes);
      (this.$refs.addMenuRef as { show: Common.Fun }).show(
        'query',
        selectNodes[0]
      );
    },
    handleSeleceCategory(node: { value: number }) {
      this.parentId = node.value;
      (this.$refs.tableLayoutRef as { resetSearch: Common.Fun }).resetSearch();
    },
    reSearch() {
      (this.$refs.tableLayoutRef as { resetSearch: Common.Fun }).resetSearch();
    },
  },
  render() {
    const { tableHeader, formJson, columns, handleSearch, reSearch } = this;

    return (
      <div class="container">
        <TableLayout
          ref="tableLayoutRef"
          tableHeader={tableHeader as unknown as VueComponentNode[]}
          formJson={formJson}
          columns={columns}
          search={handleSearch}
        ></TableLayout>
        <AddMenu ref="addMenuRef" onUpdate={reSearch} />
      </div>
    );
  },
});
