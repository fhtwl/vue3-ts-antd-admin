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
  Table,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  TreeSelect,
  Tree,
  Upload,
  Radio,
  Checkbox,
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
  Table,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  TreeSelect,
  Tree,
  Upload,
  Radio,
  Checkbox,
];

export default function setupAtnd(app: App<Element>) {
  components.forEach((component) => {
    app.use(component);
  });
  app.config.globalProperties.$message = message;
  app.config.globalProperties.$confirm = Modal.confirm;
}
