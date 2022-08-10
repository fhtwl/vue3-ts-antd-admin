import { defineComponent, ref, reactive, getCurrentInstance } from 'vue';
import TableLayout from '@/components/TableLayout';
import { getMenuList, deleteMenuByIds } from '@/api/system/menu';
import './index.less';
import AddMenu, { MenuFormData } from './AddMenu';
import { VueComponentNode } from '@/components/TableLayout/Tool';
import { CommonFormItem } from '@/components/CommonForm';

export default defineComponent({
  setup() {
    const parentId = ref<number>(0);

    const formData = reactive<{ name: string }>({
      name: '',
    });
    const formJson = reactive<CommonFormItem[]>([
      {
        type: 'input',
        label: '名称',
        fieldName: 'name',
        extraConfig: {
          // className: "row",
        },
        dataType: String,
      },
    ]);
    const columns = reactive<Common.TableColumns[]>([
      {
        title: '名称',
        dataIndex: 'name',
        width: 120,
      },
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
    ]);
    const instance = getCurrentInstance();
    const addMenuRef = ref<InstanceType<typeof AddMenu>>();
    const tableLayoutRef = ref<InstanceType<typeof TableLayout>>();
    const handleAddClick = function () {
      addMenuRef.value?.show('add');
    };
    const handleEditClick = function (
      _selectKey: number[],
      selectNodes: MenuFormData[]
    ) {
      addMenuRef.value?.show('edit', selectNodes[0]);
    };
    const handleDeleteClick = function (
      _selectKey: unknown,
      selectNodes: Common.TreeNode[]
    ) {
      instance?.proxy!.$confirm({
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
            instance?.proxy!.$message.success('删除成功');
            reSearch();
          });
        },
      });
    };
    const handleDetailsClick = function (
      _selectKeys: number[],
      selectNodes: MenuFormData[]
    ) {
      addMenuRef.value?.show('query', selectNodes[0]);
    };
    const reSearch = function () {
      tableLayoutRef.value?.resetSearch();
    };
    const tableHeader = reactive<VueComponentNode[]>([
      <a-button
        key="approve-add"
        onClick={handleAddClick}
        action="add"
        v-action="system:menu:add"
      >
        <c-icon type="add" />
        新增
      </a-button>,
      <a-button
        key="approve-delete"
        onClick={handleDeleteClick}
        action="delete"
        v-action="system:menu:delete"
      >
        <c-icon type="delete" />
        删除
      </a-button>,
      <a-button
        key="approve-edit"
        onClick={handleEditClick}
        action="edit"
        v-action="system:menu:edit"
      >
        <c-icon type="move" />
        编辑
      </a-button>,
      <a-button
        key="approve-query"
        onClick={handleDetailsClick}
        action="query"
        v-action="system:menu:query"
      >
        <c-icon type="details" />
        预览
      </a-button>,
    ] as unknown as VueComponentNode[]);
    return {
      parentId,
      formData,
      formJson,
      columns,
      tableHeader,
      reSearch,
      addMenuRef,
      tableLayoutRef,
    };
  },

  render() {
    const { tableHeader, formJson, columns, reSearch } = this;

    return (
      <div class="container">
        <TableLayout
          ref="tableLayoutRef"
          tableHeader={tableHeader as unknown as VueComponentNode[]}
          formJson={formJson}
          columns={columns}
          search={getMenuList}
        ></TableLayout>
        <AddMenu ref="addMenuRef" onUpdate={reSearch} />
      </div>
    );
  },
});
