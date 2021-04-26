import { DefineComponent, Plugin } from 'vue';


declare const Trees: Exclude<Plugin['install'], undefined>;
export default Trees;

export const TreesSample: DefineComponent<{}, {}, any>;
