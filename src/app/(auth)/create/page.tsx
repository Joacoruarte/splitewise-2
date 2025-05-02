import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createUser() {
  try {
    const user = await prisma.user.create({
      data: {
        external_id: 'test-' + Date.now(),
        email: `test${Date.now()}@example.com`,
        name: 'Test User',
      },
    })
    return user
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

export default async function CreatePage() {
  const user = await createUser()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">User Created</h1>
      <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  )
}
