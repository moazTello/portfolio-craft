'use client'

import { useEffect, useState, useRef } from 'react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { usePortfolioGuard } from '@/hooks/usePortfolioGuard'
import { LoadingSkeleton } from '@/components/shared/LoadingSpinner'

async function compressImage(file: File, maxWidth = 1200, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      let width = img.width
      let height = img.height
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width)
        width = maxWidth
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = reject
    img.src = url
  })
}

export default function GalleryPage() {
  const ready = usePortfolioGuard()
  const [images, setImages] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editCaption, setEditCaption] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [lightbox, setLightbox] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!ready) return
    fetchGallery()
  }, [ready])

  async function fetchGallery() {
    try {
      const [imagesRes, statsRes] = await Promise.all([
        api.get('/gallery').then(r => r.json()),
        api.get('/gallery/stats').then(r => r.json()),
      ])
      setImages(Array.isArray(imagesRes) ? imagesRes : [])
      setStats(statsRes)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    if (!stats?.canAdd) {
      toast.error(`You've reached your ${stats?.plan} plan limit of ${stats?.limit} images`)
      return
    }

    setUploading(true)
    let uploaded = 0

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 10MB)`)
        continue
      }

      try {
        const imageUrl = await compressImage(file)
        await api.post('/gallery', { imageUrl })
        uploaded++
      } catch {
        toast.error(`Failed to upload ${file.name}`)
      }
    }

    if (uploaded > 0) {
      toast.success(`${uploaded} image${uploaded > 1 ? 's' : ''} uploaded!`)
      fetchGallery()
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function deleteImage(id: string) {
    if (!confirm('Delete this image?')) return
    try {
      await api.delete(`/gallery/${id}`)
      toast.success('Image deleted')
      fetchGallery()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  async function saveEdit(id: string) {
    try {
      await api.patch(`/gallery/${id}`, { caption: editCaption, category: editCategory })
      toast.success('Updated!')
      setEditingId(null)
      fetchGallery()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  if (!ready || loading) return <LoadingSkeleton rows={4} />

  const usagePercent = stats?.limit ? Math.round((stats.count / stats.limit) * 100) : 0

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Gallery</h1>
          <p className="text-sm text-gray-500 mt-1">Showcase your work with photos</p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading || !stats?.canAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
        >
          {uploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Uploading...
            </>
          ) : (
            <>+ Add Images</>
          )}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {/* Usage Bar */}
      {stats && (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Storage Usage
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                stats.plan === 'BUSINESS' ? 'bg-purple-100 text-purple-700' :
                stats.plan === 'PRO' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-600'
              }`}>{stats.plan}</span>
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {stats.count} / {stats.limit === null ? '∞' : stats.limit} images
            </p>
          </div>
          {stats.limit && (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  usagePercent >= 90 ? 'bg-red-500' :
                  usagePercent >= 70 ? 'bg-amber-500' : 'bg-indigo-500'
                }`}
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              />
            </div>
          )}
          {!stats.canAdd && (
            <p className="text-xs text-red-500 mt-2">
              You've reached your limit.
              <a href="/dashboard/settings/billing" className="text-indigo-500 hover:underline ml-1">Upgrade to add more →</a>
            </p>
          )}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 ? (
        <div
          onClick={() => stats?.canAdd && fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-16 text-center ${
            stats?.canAdd
              ? 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 cursor-pointer transition'
              : 'border-gray-100 dark:border-gray-800'
          }`}
        >
          <p className="text-4xl mb-4">🖼️</p>
          <p className="text-gray-500 font-medium">No images yet</p>
          <p className="text-gray-400 text-sm mt-1">
            {stats?.canAdd ? 'Click to upload your first image' : 'Upgrade your plan to add images'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(img => (
            <div key={img.id} className="group relative bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden aspect-square">
              {/* Image */}
              <img
                src={img.imageUrl}
                alt={img.caption ?? ''}
                className="w-full h-full object-cover cursor-zoom-in"
                onClick={() => setLightbox(img.imageUrl)}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition flex flex-col justify-between p-3 opacity-0 group-hover:opacity-100">
                {/* Top actions */}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingId(img.id)
                      setEditCaption(img.caption ?? '')
                      setEditCategory(img.category ?? '')
                    }}
                    className="bg-white/20 hover:bg-white/30 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteImage(img.id)}
                    className="bg-red-500/80 hover:bg-red-600 text-white text-xs px-2 py-1 rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>

                {/* Bottom caption */}
                {img.caption && (
                  <p className="text-white text-xs font-medium truncate">{img.caption}</p>
                )}
              </div>

              {/* Category badge */}
              {img.category && (
                <div className="absolute top-2 left-2">
                  <span className="text-xs bg-black/50 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {img.category}
                  </span>
                </div>
              )}
            </div>
          ))}

          {/* Upload more */}
          {stats?.canAdd && (
            <div
              onClick={() => fileRef.current?.click()}
              className="aspect-square border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition"
            >
              <div className="text-center">
                <p className="text-3xl text-gray-300 mb-1">+</p>
                <p className="text-xs text-gray-400">Add more</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={e => { if (e.target === e.currentTarget) setEditingId(null) }}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Edit Image</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Caption</label>
                <input
                  value={editCaption}
                  onChange={e => setEditCaption(e.target.value)}
                  placeholder="Describe this image..."
                  className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Category</label>
                <input
                  value={editCategory}
                  onChange={e => setEditCategory(e.target.value)}
                  placeholder="e.g. Architecture, Interior, Exterior..."
                  className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => saveEdit(editingId)}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
              >
                Save
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 py-2 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl"
          >✕</button>
          <img
            src={lightbox}
            alt=""
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}