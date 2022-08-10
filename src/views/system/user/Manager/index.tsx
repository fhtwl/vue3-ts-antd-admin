import { defineComponent, ref, reactive, getCurrentInstance } from 'vue';
import TableLayout from '@/components/TableLayout';
import { getUserList, deleteUserByIds } from '@/api/system/user';

import AddUser from './AddUser';
import { VueComponentNode } from '@/components/TableLayout/Tool';
import ViewerImg from '@/components/ViewerImg';
import { CommonFormItem } from '@/components/CommonForm';
import { UserFormData } from './AddUser/index';
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
        title: '角色',
        dataIndex: 'roleName',
        width: 80,
      },
      {
        title: '更新时间',
        dataIndex: 'updatedAt',
        width: 80,
      },
    ]);
    const handleEditClick = function (
      _selectKey: number[],
      selectNodes: UserFormData[]
    ) {
      addUserRef?.value?.show('edit', selectNodes[0]);
    };
    const handleDeleteClick = function (
      _selectKey: unknown,
      selectNodes: Common.TreeNode[]
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
          each(selectNodes);
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
    const tableHeader = reactive<VueComponentNode[]>([
      <a-button
        key="approve-delete"
        onClick={handleDeleteClick}
        action="delete"
        v-action="system:user:delete"
      >
        <c-icon type="delete" />
        删除
      </a-button>,
      <a-button
        key="approve-move"
        onClick={handleEditClick}
        action="edit"
        v-action="system:user:edit"
      >
        <c-icon type="move" />
        编辑
      </a-button>,
      <a-button
        key="approve-details"
        onClick={handleDetailsClick}
        action="query"
        v-action="system:user:query"
      >
        <c-icon type="details" />
        预览
      </a-button>,
    ] as unknown as VueComponentNode[]);
    return {
      instance,
      addUserRef,
      parentId,
      formData,
      formJson,
      columns,
      tableHeader,
      reSearch,
    };
  },

  render() {
    const { tableHeader, formJson, columns, reSearch } = this;

    return (
      <div class="container">
        <TableLayout
          ref="tableLayoutRef"
          tableHeader={tableHeader}
          formJson={formJson}
          columns={columns}
          search={getUserList}
        ></TableLayout>
        <AddUser ref="addUserRef" onUpdate={reSearch} />
      </div>
    );
  },
});
