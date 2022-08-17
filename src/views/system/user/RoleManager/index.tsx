import { defineComponent, getCurrentInstance, reactive, ref } from 'vue';
import TableLayout from '@/components/TableLayout';
import { getRoleList, deleteRoleByIds } from '@/api/system/role';
import { VueComponentNode } from '@/components/TableLayout/Tool';
import { CommonFormItem } from '@/components/CommonForm';

import AddRole, { RoleFormData } from './AddRole';
import MenuPermission, { MenuPermissionFormData } from './MenuPermission';

export default defineComponent({
  setup() {
    const addRoleRef = ref<InstanceType<typeof AddRole>>();
    const tableLayoutRef = ref<InstanceType<typeof TableLayout>>();
    const menuPermissionRef = ref<InstanceType<typeof MenuPermission>>();
    const instance = getCurrentInstance();

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
        width: 80,
      },
      {
        title: '描述',
        dataIndex: 'describe',
        width: 120,
      },
      {
        title: '更新时间',
        dataIndex: 'updatedAt',
        width: 80,
      },
    ]);

    const handleAddClick = function () {
      console.log(addRoleRef);
      addRoleRef.value?.show('add');
    };
    const handleEditClick = function (
      _selectKeys: number[],
      selectNodes: RoleFormData[]
    ) {
      addRoleRef.value!.show('edit', selectNodes[0]);
    };
    const handleDeleteClick = function (
      _selectKeys: number[],
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
          deleteRoleByIds({
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
      selectNodes: RoleFormData[]
    ) {
      addRoleRef?.value?.show('query', selectNodes[0]);
    };
    const reSearch = function () {
      tableLayoutRef?.value?.resetSearch();
    };
    const handleEditMenuClick = function (
      _selectKeys: number[],
      selectNodes: MenuPermissionFormData[]
    ) {
      menuPermissionRef?.value?.show(selectNodes[0]);
    };
    const tableHeader = reactive<VueComponentNode[]>([
      <a-button
        key="approve-add"
        onClick={handleAddClick}
        action="add"
        v-action="system:role:add"
      >
        <c-icon type="add" />
        新增
      </a-button>,
      <a-button
        key="approve-delete"
        onClick={handleDeleteClick}
        action="delete"
        v-action="system:role:delete"
      >
        <c-icon type="delete" />
        删除
      </a-button>,
      <a-button
        key="approve-edit"
        onClick={handleEditClick}
        action="edit"
        v-action="system:role:edit"
      >
        <c-icon type="move" />
        编辑
      </a-button>,
      <a-button
        key="approve-query"
        onClick={handleDetailsClick}
        action="query"
        v-action="system:role:query"
      >
        <c-icon type="details" />
        预览
      </a-button>,
      <a-button
        key="approve-permission"
        onClick={handleEditMenuClick}
        action="query"
        v-action="system:role:editPermission"
      >
        <c-icon type="setting" />
        权限设置
      </a-button>,
    ] as unknown as VueComponentNode[]);
    return {
      formJson,
      columns,
      tableHeader,
      reSearch,
      formData,
      handleAddClick,
      addRoleRef,
      instance,
      menuPermissionRef,
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
          search={getRoleList}
        ></TableLayout>
        <AddRole ref="addRoleRef" onUpdate={reSearch} />
        <MenuPermission ref="menuPermissionRef" onUpdate={reSearch} />
      </div>
    );
  },
});
