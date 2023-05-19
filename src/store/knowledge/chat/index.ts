import pinia, { defineStore } from 'pinia';
import { login, logout } from '@/api/system/auth';
import { getUserInfo } from '@/api/system/user';
import { Permission } from '@fhtwl-admin/system';
import { generateRandomID } from '@/utils/utils';

type ChatRole = 'user' | 'system';
type ChatStatus = 'error' | 'success' | 'loading';
interface Chat {
  name: ChatRole;
  message: string;
  status: ChatStatus;
}
interface ChatItem {
  id: string;
  name: string;
  chat: Chat[];
}

export const useStore = defineStore('chat', {
  state: () => ({
    chat: [] as Chat[],
    chats: [] as ChatItem[],
    chatIndex: 0,
  }),
  actions: {
    getNewChat(name = '新的聊天') {
      return {
        id: generateRandomID(),
        name,
        chat: [],
      };
    },
    getChats(): ChatItem[] {
      const chats = localStorage.getItem('chat')
        ? JSON.parse(localStorage.getItem('chat') as string)?.chats
        : [this.getNewChat()];
      return chats;
    },
    setChats(chats: ChatItem[]) {
      this.chats = chats;
    },

    /**
     * 新增一个聊天
     */
    addChat() {
      const chats = this.getChats();
      this.chats = [...chats, this.getNewChat()];
    },

    /**
     * 删除一个聊天
     * @param {*} index
     */
    removeChat(index: number) {
      const chats = this.getChats();
      chats.splice(index, 1);
      this.setChats(chats);
    },

    getChat() {
      const chat = this.chat; // localStorage.getItem('chat') || [];
      return chat;
    },
    setChat(chat: Chat[]) {
      const chats = this.getChats();
      const chatIndex = this.getChatIndex();
      chats[chatIndex] = {
        ...chats[chatIndex],
        chat,
      };
      this.setChats(chats);
    },

    getChatIndex(): number {
      const chatIndex = Number(localStorage.getItem('chatIndex')) || 0;
      return chatIndex;
    },

    setChatIndex(index: number) {
      this.chatIndex = index;
    },
  },
  // persist: {
  //   enabled: true,
  // },
});
