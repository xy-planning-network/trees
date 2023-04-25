export interface Conifer {
  id: number
  discoveryDate: string
  name: number
  type: string
  leaf: {
    type: "Needle-leaf" | "Scale-leaf"
    length: string
  }
}
