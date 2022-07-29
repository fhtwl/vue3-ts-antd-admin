import TableLayout from '@/components/TableLayout';
import { getMenuList, deleteMenuByIds } from '@/api/system/menu';
import './index.less';
import AddMenu from './AddMenu';

export default {
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
      ],
      list: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
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
          customRender: (text) => {
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
    handleSearch(data, resolve) {
      getMenuList({ ...data }).then(resolve);
    },
    handleAddClick() {
      this.$refs.addMenuRef.show('add');
    },
    handleEditClick(selectKey, selectNodes) {
      this.$refs.addMenuRef.show('edit', selectNodes[0]);
    },
    handleDeleteClick(selectKey, selectNodes) {
      this.$confirm({
        title: '是否确认删除',
        content: '删除该菜单会删除该菜单的所有子菜单',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        maskClosable: false,
        onOk: () => {
          const ids = [];
          const each = (tree) => {
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
    handleDetailsClick(selectKey, selectNodes) {
      this.$refs.addMenuRef.show('details', selectNodes[0]);
    },
    handleSeleceCategory(node) {
      this.parentId = node.value;
      this.$refs.tableLayoutRef.resetSearch();
    },
    reSearch() {
      this.$refs.tableLayoutRef.resetSearch();
    },
  },
  render() {
    const { tableHeader, formJson, columns, handleSearch, reSearch } = this;

    return (
      <div class="container">
        <TableLayout
          ref="tableLayoutRef"
          tableHeader={tableHeader}
          formJson={formJson}
          columns={columns}
          search={handleSearch}
        ></TableLayout>
        <AddMenu ref="addMenuRef" onUpdate={reSearch} />
      </div>
    );
  },
};
