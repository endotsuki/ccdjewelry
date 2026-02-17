import { Card, CardContent } from '@/components/ui/card';
import { Mail02Icon, SmartPhone01Icon, TelegramIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export function ContactInfoCards() {
  const contactInfo = [
    { icon: Mail02Icon, title: 'Email', content: 'ccdjewelry@gmail.com' },
    { icon: SmartPhone01Icon, title: 'Phone', content: '+1 (555) 123-4567' },
    { icon: TelegramIcon, title: 'Telegram', content: '@CCDJewelry' },
  ];

  return (
    <div className='mt-8 grid gap-6 md:grid-cols-3'>
      {contactInfo.map((info, index) => (
        <Card key={index} className='border-0 shadow-md'>
          <CardContent className='flex flex-col items-center p-6 text-center'>
            <HugeiconsIcon size={20} icon={info.icon} className='text-primary mb-4 h-10 w-10' />
            <h3 className='mb-2 text-lg font-semibold'>{info.title}</h3>
            <p className='text-sm'>{info.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
