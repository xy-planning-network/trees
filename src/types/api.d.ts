declare namespace API {
  // Used to enable override functionality to default behavior on API calls
  export interface RequestOptions {
    skipLoader?: boolean;
  }
}

export default API;
