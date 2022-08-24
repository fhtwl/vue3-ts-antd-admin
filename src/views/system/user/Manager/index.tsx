import { defineComponent, ref, reactive, getCurrentInstance } from 'vue';
import TableLayout from '@/components/TableLayout';
import { getUserList, deleteUserByIds } from '@/api/system/user';

import AddUser from './AddUser';
import ViewerImg from '@/components/ViewerImg';
import { CommonFormItem } from '@/components/CommonForm';
import { UserFormData } from './AddUser/index';
import { ToolButton } from '../../../../components/TableLayout/Tool/index';
export default defineComponent({
  setup() {
    const instance = getCurrentInstance();
    const addUserRef = ref<InstanceType<typeof AddUser>>();
    const tableLayoutRef = ref<InstanceType<typeof TableLayout>>();

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
        title: '昵称',
        dataIndex: 'nickName',
        width: 80,
        customRender: ({ record }) => {
          return (record.info as System.UserInfo).nickName as string;
        },
      },
      {
        title: '头像',
        dataIndex: 'avatar',
        width: 80,
        customRender: ({ record }) => {
          return (
            <ViewerImg images={[(record.info as System.UserInfo).avatar]} />
          );
        },
      },
      {
        title: '用户名',
        dataIndex: 'userName',
        width: 80,
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        width: 100,
      },
      {
        title: '角色',
        dataIndex: 'roleNames',
        width: 80,
      },
      {
        title: '更新时间',
        dataIndex: 'updatedAt',
        width: 80,
      },
    ]);
    const handleAddClick = function () {
      addUserRef.value?.show('add');
    };
    const handleEditClick = function (
      _selectKey: number[],
      selectNodes: UserFormData[]
    ) {
      addUserRef?.value?.show('edit', selectNodes[0]);
    };
    const handleDeleteClick = function (
      _selectKey: number[],
      selectNodes: UserFormData[]
    ) {
      instance?.proxy!.$confirm({
        title: '是否确认删除',
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
          each(selectNodes as unknown as Common.TreeNode[]);
          deleteUserByIds({
            ids: ids.join(','),
          }).then(() => {
            instance?.proxy!.$message.success('删除成功');
            reSearch();
          });
        },
      });
    };
    const handleDetailsClick = function (
      _selectKey: number[],
      selectNodes: UserFormData[]
    ) {
      addUserRef?.value?.show('query', selectNodes[0]);
    };
    const reSearch = function () {
      tableLayoutRef?.value?.resetSearch();
    };
    const buttons = reactive<ToolButton<number, UserFormData>[]>([
      {
        key: 'approve-add',
        onClick: handleAddClick,
        action: 'add',
        vAction: 'system:user:add',
        icon: 'add',
        text: '新增',
      },
      {
        key: 'approve-edit',
        onClick: handleEditClick,
        action: 'edit',
        vAction: 'system:user:edit',
        icon: 'edit',
        text: '编辑',
      },
      {
        key: 'approve-delete',
        onClick: handleDeleteClick,
        action: 'delete',
        vAction: 'system:user:delete',
        icon: 'delete',
        text: '删除',
      },
      {
        key: 'approve-query',
        onClick: handleDetailsClick,
        action: 'query',
        vAction: 'system:user:query',
        icon: 'details',
        text: '详情',
      },
    ]);
    return {
      instance,
      addUserRef,
      parentId,
      formData,
      formJson,
      columns,
      buttons,
      reSearch,
    };
  },

  render() {
    const { buttons, formJson, columns, reSearch } = this;

    return (
      <div class="container">
        <TableLayout
          ref="tableLayoutRef"
          buttons={buttons}
          formJson={formJson}
          columns={columns}
          search={getUserList}
        ></TableLayout>
        <AddUser ref="addUserRef" onUpdate={reSearch} />
      </div>
    );
  },
});
