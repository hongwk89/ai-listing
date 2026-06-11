export interface ProductInput {
  grade: string
  origin: string
  storage: string
  delivery: string
  highlight: string
}

export interface ProductResult {
  name: string
  sellingPoints: string[]
  description: string
  tags: string[]
}
