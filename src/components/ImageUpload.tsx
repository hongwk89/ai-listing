import { useRef } from 'react'

interface Props {
  preview: string | null
  onChange: (file: File, preview: string) => void
}

export function ImageUpload({ preview, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    if (file.size > 10 * 1024 * 1024) return
    onChange(file, URL.createObjectURL(file))
  }

  return (
    <div
      className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-blue-400 transition-colors"
      onClick={() => inputRef.current?.click()}
      onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
      onDragOver={(e) => e.preventDefault()}
    >
      {preview ? (
        <img src={preview} alt="상품 미리보기" className="w-full h-64 object-cover" />
      ) : (
        <div className="h-64 flex flex-col items-center justify-center gap-2 text-gray-400">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">클릭하거나 사진을 드래그하세요</p>
          <p className="text-xs">JPG, PNG, WEBP · 최대 10MB</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />
    </div>
  )
}
