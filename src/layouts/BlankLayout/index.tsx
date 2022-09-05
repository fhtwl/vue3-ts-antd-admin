import { defineComponent } from 'vue';

// 空白布局, 备用
export default defineComponent({
  name: 'BlankLayout',
  render() {
    return (
      <div>
        <router-view />
      </div>
    );
  },
});
