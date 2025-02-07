import { beforeAll, afterAll, afterEach } from 'vitest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.test' })

let mongoServer: MongoMemoryServer

beforeAll(async () => {
  // Create MongoDB Memory Server
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()
  
  // Connect to the in-memory database
  await mongoose.connect(mongoUri)
})

afterEach(async () => {
  // Clean up database after each test
  const collections = await mongoose.connection.db?.collections()
  if(!collections) {
    throw new Error('Collections not found')
  }
  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  // Disconnect and stop the server
  await mongoose.disconnect()
  await mongoServer.stop()
}) 
