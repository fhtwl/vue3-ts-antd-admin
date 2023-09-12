import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const count = ref(0);
    const setCount = () => count.value++;
    return {
      count,
      setCount,
    };
  },
  render() {
    return (
      <div>
        {this.count} <a-button onClick={this.setCount}>add</a-button>
      </div>
    );
  },
});
