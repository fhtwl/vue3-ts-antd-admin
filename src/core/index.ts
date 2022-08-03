import { App } from 'vue';
import action from './directives/action';
export default function initCore(app: App<Element>) {
  app.directive(action.name, action.directive);
}
