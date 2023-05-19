import { useStore } from '@/store/knowledge/chat';
import { computed, defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'Chat',
  setup() {
    const store = useStore();
    return {
      chat: computed(() => store.chat),
      chats: computed(() => store.chats),
      chatIndex: computed(() => store.chatIndex),
      list: [...store.getChats()],
      isEdit: false,
      editData: {
        name: '',
        index: 0,
      },
      store,
    };
  },
  methods: {
    /**
     * 保存数据
     */
    save() {
      this.store.setChats(this.list);
      this.store.setChatIndex(this.chatIndex);
    },
    /**
     * 打开时初始化数据
     */
    init() {
      this.list = [...this.store.getChats()];
    },
    /**
     * 新增聊天
     */
    handleAdd() {
      this.store.addChat();
      this.updateList();
    },
    /**
     * 删除聊天
     * @param e
     * @param index
     */
    handleRemove(e: Event, index: number) {
      e.stopPropagation();
      this.store.removeChat(index);
      this.updateList();
    },
    /**
     * 编辑聊天名称
     * @param e
     * @param index
     */
    handleEdit(e: Event, index: number) {
      e.stopPropagation();
      this.editData.index = index;
      this.editData.name = this.list[index].name;
      this.isEdit = true;
    },
    /**
     * 点击选择聊天
     * @param {*} index
     */
    handleSelect(index: number) {
      this.chatIndex = index;
      this.store.setChatIndex(index);
    },
    /**
     * 更新聊天
     */
    updateList() {
      this.list = [...this.store.getChats()];
    },
    /**
     * 保存修改的聊天名称
     */
    handleSaveName() {
      this.list[this.editData.index].name = this.editData.name;
      this.isEdit = false;
      this.resetEditData();
    },
    /**
     * 关闭聊天
     */
    handleCancelName() {
      this.isEdit = false;
      this.resetEditData();
    },
    /**
     * 初始化聊天编辑数据
     */
    resetEditData() {
      this.editData.index = 0;
      this.editData.name = '';
    },
  },
  render() {
    const {
      handleAdd,
      handleSelect,
      list,
      chatIndex,
      handleEdit,
      handleRemove,
      isEdit,
      handleSaveName,
      editData,
      handleCancelName,
    } = this;
    return (
      <view class="multiple-session">
        <view onClick={handleAdd} class="btn add">
          <u-icon name="plus"></u-icon>
          <text class="name">新建聊天</text>
        </view>
        <view class="list">
          {list.map((item, index) => {
            return (
              <view
                onClick={() => handleSelect(index)}
                key={item.id}
                class={`btn ${chatIndex === index ? 'active' : ''}`}
              >
                <view class="left">
                  <u-icon name="chat"></u-icon>
                  <text class="name">{item.name}</text>
                </view>
                <view class="right">
                  <u-icon
                    size="40rpx"
                    onClick={(e: Event) => handleEdit(e, index)}
                    name="edit-pen"
                  ></u-icon>
                  <u-icon
                    size="40rpx"
                    onClick={(e: Event) => handleRemove(e, index)}
                    customStyle="margin-left: 10rpx"
                    name="trash"
                  ></u-icon>
                </view>
              </view>
            );
          })}

          <a-modal
            visible={isEdit}
            title="修改名称"
            onOk={handleSaveName}
            onCancel={handleCancelName}
          >
            <view class="slot-content">
              <a-input v-model={editData.name} />
            </view>
          </a-modal>
        </view>
      </view>
    );
  },
});
