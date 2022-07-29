import {
  Button,
  TimePicker,
  Menu,
  Tabs,
  Dropdown,
  List,
  Switch,
  message,
  Modal,
} from 'ant-design-vue';

import { App } from 'vue';

const components = [
  Button,
  TimePicker,
  Menu,
  Tabs,
  List,
  Switch,
  Dropdown,
  Modal,
];

export default function setupAtnd(app: App<Element>) {
  components.forEach((component) => {
    app.use(component);
  });
  app.config.globalProperties.$message = message;
  app.config.globalProperties.$confirm = Modal.confirm;
}
