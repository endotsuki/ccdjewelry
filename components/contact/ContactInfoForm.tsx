import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

interface ContactInfoFormProps {
  formData: {
    name: string;
    contact: string;
    email: string;
    message: string;
  };
  isOrderMode: boolean;
  submitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function ContactInfoForm({ formData, isOrderMode, submitting, onSubmit, onChange }: ContactInfoFormProps) {
  const fields = [
    {
      name: 'name',
      label: 'Full Name *',
      placeholder: 'John Doe',
      required: true,
      type: 'input' as const,
    },
    {
      name: 'contact',
      label: 'Phone or Telegram *',
      placeholder: '+1234567890 or @username',
      required: true,
      type: 'input' as const,
    },
    {
      name: 'email',
      label: 'Email (Optional)',
      placeholder: 'john@example.com',
      required: false,
      type: 'input' as const,
      inputType: 'email' as const,
    },
    {
      name: 'message',
      label: `Message ${isOrderMode ? '(Optional)' : '*'}`,
      placeholder: isOrderMode ? 'Any special requests or delivery notes...' : 'How can we help you?',
      required: !isOrderMode,
      type: 'textarea' as const,
      rows: isOrderMode ? 4 : 6,
    },
  ];

  return (
    <Card className={isOrderMode ? 'sticky top-20' : ''}>
      <CardContent className='p-6'>
        {isOrderMode && <h2 className='mb-6 text-2xl font-bold'>Contact Information</h2>}

        <form onSubmit={onSubmit} className='space-y-4'>
          {fields.map((field) => (
            <div key={field.name} className='space-y-2'>
              <label htmlFor={field.name} className='flex items-center gap-2'>
                <h6>{field.label}</h6>
              </label>
              {field.type === 'input' ? (
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.inputType || 'text'}
                  placeholder={field.placeholder}
                  required={field.required}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={onChange}
                />
              ) : (
                <Textarea
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  rows={field.rows}
                  required={field.required}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={onChange}
                />
              )}
            </div>
          ))}

          <Button type='submit' className='w-full' disabled={submitting}>
            {submitting ? <>{isOrderMode ? 'Sending Order...' : 'Sending...'}</> : isOrderMode ? 'Place Order' : 'Send Message'}
          </Button>

          {isOrderMode && (
            <p className='text-muted-foreground text-center text-xs'>
              * Required fields. We'll contact you to confirm your order and arrange delivery.
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
