import { useState } from 'react'
import { ImageUpload } from './components/ImageUpload'
import { ProductForm } from './components/ProductForm'
import { ResultSection } from './components/ResultSection'
import type { ProductInput, ProductResult } from './types'

const INITIAL_FORM: ProductInput = {
  grade: '',
  origin: '',
  storage: '',
  delivery: '',
  highlight: ''
}

export default function App() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [form, setForm] = useState<ProductInput>(INITIAL_FORM)
  const [result, setResult] = useState<ProductResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async () => {
    if (!file) return
    setIsLoading(true)
    setResult(null)

    try {
      const base64 = await fileToBase64(file)
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mimeType: file.type, ...form })
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error)
      }

      setResult(await response.json())
    } catch (error) {
      alert(error instanceof Error ? error.message : 'AI 생성 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve((reader.result as string).split(',')[1])
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">AI 상품 등록 도우미</h1>
          <p className="text-sm text-gray-500 mt-1">
            상품 사진과 기본 정보를 입력하면 AI가 상품명 · 셀링포인트 · 상세설명 · 태그를 생성합니다
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">상품 사진</h2>
              <ImageUpload
                preview={preview}
                onChange={(f, previewUrl) => { setFile(f); setPreview(previewUrl) }}
              />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">상품 정보</h2>
              <ProductForm value={form} onChange={setForm} />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!preview || isLoading}
              className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? '생성 중...' : 'AI 카피 생성하기'}
            </button>
          </div>

          <div>
            {isLoading ? (
              <div className="h-64 flex items-center justify-center bg-white rounded-xl border border-gray-200">
                <div className="text-center text-gray-400">
                  <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-sm">AI가 카피를 작성하고 있어요</p>
                </div>
              </div>
            ) : result ? (
              <ResultSection result={result} />
            ) : (
              <div className="h-64 flex items-center justify-center bg-white rounded-xl border border-dashed border-gray-200">
                <div className="text-center text-gray-400">
                  <p className="text-sm">사진을 업로드하고</p>
                  <p className="text-sm">생성 버튼을 누르면 여기에 결과가 표시됩니다</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
