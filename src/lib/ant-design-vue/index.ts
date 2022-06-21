import {
  Button,
  TimePicker,
  Menu,
  Tabs,
  Dropdown,
  List,
  Switch,
  message,
} from 'ant-design-vue';
import { App } from 'vue';

const components = [Button, TimePicker, Menu, Tabs, List, Switch, Dropdown];

export default function setupAtnd(app: App<Element>) {
  components.forEach((component) => {
    app.use(component);
  });
  app.config.globalProperties.$message = message;
}
