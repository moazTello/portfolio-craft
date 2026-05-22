import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { v2 as cloudinary } from 'cloudinary'

@Injectable()
export class UploadService {
  constructor(private config: ConfigService) {
    cloudinary.config({
      cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get('CLOUDINARY_API_KEY'),
      api_secret: this.config.get('CLOUDINARY_API_SECRET'),
    })
  }

  async uploadImage(base64: string, folder: string = 'portfoliocraft'): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(base64, {
        folder,
        transformation: [
          { width: 1200, quality: 'auto', fetch_format: 'auto' }
        ]
      })
      return result.secure_url
    } catch (e) {
      console.error('Cloudinary upload error:', e)
      throw new Error('Image upload failed')
    }
  }

  async deleteImage(url: string): Promise<void> {
    try {
      // استخرج الـ public_id من الـ URL
      const parts = url.split('/')
      const filename = parts[parts.length - 1].split('.')[0]
      const folder = parts[parts.length - 2]
      await cloudinary.uploader.destroy(`${folder}/${filename}`)
    } catch (e) {
      console.error('Cloudinary delete error:', e)
    }
  }
}