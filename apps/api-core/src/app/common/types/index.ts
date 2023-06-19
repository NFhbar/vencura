import { Request as ExpressRequest } from 'express'
import { User } from '../../entities'

export interface Request<T extends User> extends ExpressRequest {
  user: T
}

export interface IUserAuthPayload {
  id: number
  username: string | null
  iat?: number
  exp?: number
}

export * from './config'
