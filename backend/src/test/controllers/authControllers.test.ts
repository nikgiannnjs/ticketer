import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '@/app'
import { Admin } from '@/models/userModel'
import bcrypt from 'bcrypt'

describe('Auth Controllers', () => {
  describe('POST /users/login', () => {
    //before each it creates test Admin class
    beforeEach(async () => {
      // Create a test admin user
      const admin = new Admin({
        email: 'admin@test.com',
        passwordHash: await bcrypt.hash('Password123!', 10),
        status: 'active'
      })
      await admin.save()
    })

    it('should login successfully with correct credentials', async () => {
      //supertest creates a request object with correct pw
      const response = await request(app)
        .post('/users/login')
        .send({
          email: 'admin@test.com',
          password: 'Password123!'
        })
      //takes the supertest response object
      expect(response.status).toBe(200)
      expect(response.body.message).toBe('Login successfull.')
      expect(response.body.accessToken).toBeDefined()
      expect(response.body.resetToken).toBeDefined()
    })
    
    it('should return 400 for incorrect password', async () => {
      //supertest creates a request object with incorrect pw
      const response = await request(app)
        .post('/users/login')
        .send({
          email: 'admin@test.com',
          password: 'wrongpassword'
        })

      expect(response.status).toBe(400)
      expect(response.body.message).toBe('Password or email is incorrect.')
    })
  })
}) 
