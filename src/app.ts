import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import authRoutes from '@/routes/auth.routes.js'
import locationRoutes from '@/routes/location.routes.js'
import businessContactRoutes from '@/routes/business_contact.routes.js'
import fieldDefinitionRoutes from '@/routes/field-definition.routes.js'
import propertyRoutes from '@/routes/property.routes.js'
import publicPropertyRoutes from '@/routes/public-property.routes.js'
import publicLocationRoutes from '@/routes/public-location.routes.js'
import { errorMiddleware } from './middlewares/error.middleware.js'
import { Request, Response } from 'express'
const app = express()

app.set('trust proxy', 1) // 🔥 REQUIRED for Render/Vercel (secure cookies)

// Middlewares
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://roomboy-admin.vercel.app',
  'https://roomboy-public.vercel.app',
]

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true) // allow server-to-server
      if (allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  })
)
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

app.use('/auth', authRoutes)
app.use('/api/v1/admin/locations', locationRoutes)
app.use('/api/v1/admin/business-contacts', businessContactRoutes)
app.use('/api/v1/admin/field-definitions', fieldDefinitionRoutes)
app.use('/api/v1/admin/properties', propertyRoutes)
app.use('/api/v1/public', publicPropertyRoutes)
app.use('/api/v1/public/locations', publicLocationRoutes)
// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Room app API running' })
})

app.use(errorMiddleware)
export default app
