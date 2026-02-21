import { AdminLoginForm } from '@/components/admin/admin-login-form';
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login | CCD Jewelry',
  description: 'Sign in to the admin dashboard',
};

export default function AdminLoginPage() {
  return (
    <div className='relative flex min-h-svh items-center justify-center p-6 md:p-10'>
      <BackgroundRippleEffect />
      <div className='z-10 w-full max-w-sm'>
        <AdminLoginForm />
      </div>
    </div>
  );
}
