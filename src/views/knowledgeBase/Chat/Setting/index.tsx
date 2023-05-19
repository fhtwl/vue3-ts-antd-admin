import { useStore } from '@/store/knowledge/chat';
import { computed, defineComponent, ref } from 'vue';
import MultipleSession from './MultipleSession';

export default defineComponent({
  name: 'Chat',
  setup() {
    const store = useStore();
    const multipleSessionRef = ref<InstanceType<typeof MultipleSession>>();
    const init = () => {
      multipleSessionRef.value!.init();
    };
    return {
      chat: computed(() => store.chat),
      chats: computed(() => store.chats),
      chatIndex: computed(() => store.chatIndex),
      init,
      multipleSessionRef,
    };
  },
  render() {
    return (
      <div class="container">
        <div class="nav">
          <MultipleSession ref="multipleSessionRef" />
        </div>
      </div>
    );
  },
});
