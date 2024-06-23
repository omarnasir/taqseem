// 'use server'
// import { type Response } from '@/app/_types/response';

// import { auth } from '@/auth';
// import {
//   type CreateActivity
// } from '@/app/_types/activities';

// import {
//   createActivity
// } from '@/app/_data/activities';


// async function createActivityAction(data: CreateActivity): Promise<Response> {
//   const session = await auth();

//   if (!session?.user) {
//     throw new Error('Unauthorized');
//   }

//   try {
//     await createActivity(data);
//     return { success: true };
//   }
//   catch (e) {
//     return { success: false, error: e.message };
//   }
// }


// export {
//   createActivityAction
// }