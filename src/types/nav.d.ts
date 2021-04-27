import { DefineComponent } from "vue";

declare namespace Nav {
  export interface Item {
    icon?: DefineComponent<unknown, unknown, any>;
    name: string;
    url: string;
  }
}

export default Nav;
