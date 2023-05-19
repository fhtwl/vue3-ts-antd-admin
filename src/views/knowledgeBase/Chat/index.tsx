import { useStore } from '@/store/knowledge/chat';
import { computed, defineComponent, ref } from 'vue';
import Setting from './Setting';

export default defineComponent({
  name: 'Chat',
  setup() {
    const store = useStore();
    const settingRef = ref<InstanceType<typeof Setting>>();
    const init = () => {
      settingRef.value!.init();
    };
    return {
      chat: computed(() => store.chat),
      chats: computed(() => store.chats),
      chatIndex: computed(() => store.chatIndex),
      settingRef,
      init,
    };
  },
  render() {
    return (
      <div class="container">
        <div class="nav">
          <Setting ref="settingRef" />
        </div>
        <div class="head">
          <div class="title">AI助手</div>
        </div>
      </div>
    );
  },
});
