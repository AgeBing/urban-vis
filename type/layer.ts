export interface LayerData {
  id?: string,
  type?: string
  data: any,
  attr?: LayerAttr
}

export interface LayerAttr {
  color?: number[],
  strokeWidth?: number
}