declare namespace Users {
  export interface User {
    accountID: number
    accountOwner: boolean
    archived: boolean
    id: number
    email: string
    name: string
  }
}

export default Users
