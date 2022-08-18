import { defineComponent, ref, computed } from 'vue';
import EditPassword from './EditPassword';
export default defineComponent({
  setup() {
    const editPasswordRef = ref<InstanceType<typeof EditPassword>>();
    const data = computed(() => {
      return [
        {
          title: '账户密码',
          description: '密码',
          value: '**********',
          permission: 'system:user:editPassword',
          actions: {
            title: '修改',
            callback: () => editPasswordRef.value?.show(),
          },
        },
      ];
    });

    return {
      data,
      editPasswordRef,
    };
  },
  render() {
    const { data } = this;
    const listSlots = {
      renderItem: (slotData: {
        item: {
          permission: string;
          actions: {
            callback: ((payload: MouseEvent) => void) | undefined;
            title: string;
          };
          title: string;
          description: string;
          value: string;
        };
      }) => {
        const { item } = slotData;
        console.log(item);
        const itemSlots = {
          actions: () => {
            return (
              <a v-action={item.permission} onClick={item.actions.callback}>
                {item.actions.title}
              </a>
            );
          },
        };
        const itemMetaSlots = {
          description: () => (
            <span>
              <span class="security-list-description">{item.description}</span>
              <span class="security-list-value">{item.value}</span>
            </span>
          ),
        };
        return (
          <a-list-item v-slots={itemSlots}>
            <a-list-item-meta title={item.title} v-slots={itemMetaSlots} />
          </a-list-item>
        );
      },
    };

    return (
      <a-list itemLayout="horizontal" dataSource={data} v-slots={listSlots}>
        <EditPassword ref="editPasswordRef" />
      </a-list>
    );
  },
});
