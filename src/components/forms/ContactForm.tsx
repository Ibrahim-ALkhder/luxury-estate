import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
});

type FormValues = z.infer<typeof schema>;

export default function ContactForm() {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    await new Promise((r) => setTimeout(r, 1000));
    alert(t('contact.success'));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-xl mx-auto">
      <div>
        <input {...register('name')} placeholder={t('contact.name')} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-cream-300 focus:outline-none focus:ring-2 focus:ring-gold-500" />
        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <input {...register('email')} placeholder={t('contact.email')} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-cream-300 focus:outline-none focus:ring-2 focus:ring-gold-500" />
        {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <input {...register('phone')} placeholder={t('contact.phone')} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-cream-300 focus:outline-none focus:ring-2 focus:ring-gold-500" />
      </div>
      <div>
        <textarea {...register('message')} rows={5} placeholder={t('contact.message')} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-cream-300 focus:outline-none focus:ring-2 focus:ring-gold-500" />
        {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
        {isSubmitting ? t('contact.sending') : t('contact.send')}
      </button>
    </form>
  );
}