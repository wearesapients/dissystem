/**
 * Thought Attachments Component - Compact sidebar version
 */

'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from '@/lib/locale-context'
import { Paperclip, Upload, FileImage, FileText, File, X, Loader2, Plus } from 'lucide-react'

interface Props {
  thoughtId: string
}

export function ThoughtAttachments({ thoughtId }: Props) {
  const { locale } = useLocale()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles(prev => [...prev, ...selectedFiles])
    }
  }
  
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }
  
  const handleUpload = async () => {
    if (files.length === 0) return
    
    setUploading(true)
    try {
      // TODO: Implement actual file upload when API is ready
      await new Promise(resolve => setTimeout(resolve, 1000))
      setFiles([])
      router.refresh()
    } finally {
      setUploading(false)
    }
  }
  
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return FileImage
    if (type.startsWith('text/') || type.includes('document')) return FileText
    return File
  }
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }
  
  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-medium text-white/60 mb-3 flex items-center gap-2">
        <Paperclip size={14} strokeWidth={1.5} className="text-[#7A8A5C]" />
        {locale === 'ru' ? 'Вложения' : 'Attachments'}
      </h3>
      
      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2 mb-3">
          {files.map((file, index) => {
            const FileIcon = getFileIcon(file.type)
            return (
              <div
                key={index}
                className="flex items-center gap-2 p-2 bg-white/5 rounded-lg group"
              >
                <FileIcon size={16} strokeWidth={1.5} className="text-white/50 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white truncate">{file.name}</p>
                  <p className="text-[10px] text-white/40">{formatFileSize(file.size)}</p>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded transition-all"
                >
                  <X size={12} className="text-white/50" />
                </button>
              </div>
            )
          })}
          
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full py-2 bg-[#7A8A5C]/20 hover:bg-[#7A8A5C]/30 border border-[#7A8A5C]/30 rounded-lg text-sm text-[#7A8A5C] transition-colors flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                {locale === 'ru' ? 'Загрузка...' : 'Uploading...'}
              </>
            ) : (
              <>
                <Upload size={14} />
                {locale === 'ru' ? 'Загрузить' : 'Upload'}
              </>
            )}
          </button>
        </div>
      )}
      
      {/* Add button */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt,.md"
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full p-3 border border-dashed border-white/20 rounded-xl text-sm text-white/50 hover:border-[#7A8A5C]/50 hover:text-[#7A8A5C] transition-all flex items-center justify-center gap-2"
      >
        <Plus size={16} strokeWidth={1.5} />
        {locale === 'ru' ? 'Добавить файл' : 'Add file'}
      </button>
    </div>
  )
}


