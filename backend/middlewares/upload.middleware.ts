import multer from 'multer'
import path from 'node:path'
import crypto from 'node:crypto'

const storage = multer.diskStorage({
  destination: path.join(import.meta.dir, '../uploads'),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${crypto.randomUUID()}${ext}`)
  },
})

export const avatarUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  },
})
