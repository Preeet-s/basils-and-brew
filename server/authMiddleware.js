
import { supabaseAdmin } from './supabaseAdmin.js'

export async function requireAuth(req, res, next) {
  try {
    const authorization = req.headers.authorization || ''

    if (!authorization.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication required.',
      })
    }

    const token = authorization.slice(7).trim()

    if (!token) {
      return res.status(401).json({
        error: 'Invalid authentication token.',
      })
    }

    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({
        error: 'Your session is invalid or expired. Please log in again.',
      })
    }

    req.user = user
    next()
  } catch (error) {
    console.error('AUTH ERROR:', error)

    return res.status(500).json({
      error: 'Unable to verify your session.',
    })
  }
}
