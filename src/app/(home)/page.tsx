import { Navbar } from '@/components/navbar';
import { QuickActionsCard } from '@/components/quick-actions-card';
import { RecentActivityCard } from '@/components/recent-activity-card';
import { BalanceSummaryCard } from '@/components/balance-summary-card';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

export const metadata = {
  title: 'SplitWise - Home',
  description: 'Manage your expenses and split bills with friends',
};

export default async function HomePage() {
  const users = await prisma.user.findMany();

  async function create(formData: FormData) {
    'use server';
    
    const uuid = crypto.randomUUID();
    const username = formData.get('username');
   
    try {
      await prisma.user.create({
        data: {
          name: username as string,
          email: `test-${uuid}@test.com`,
          external_id: uuid,
        },
      });
    } catch (error) {
      console.log(error);
      
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.log('error.cause', error.cause);
        console.log('error.message', error.message);
        console.log('error.name', error.name);
        console.log('error.meta', error.meta);
        console.log('error.code', error.code);
        console.log('error.stack', error.stack);
        
      }
    }

    revalidatePath('/');
  }


  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <form action={create}>
        <input type="text" placeholder="write a username" name="username" />
        <button type="submit">Submit</button>
      </form>

      <pre>
        {JSON.stringify(users, null, 2)}
      </pre>
      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
        <div className='px-4 py-6 sm:px-0'>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            <QuickActionsCard />
            <RecentActivityCard />
            <BalanceSummaryCard />
          </div>
        </div>
      </main>
    </div>
  );
}
