import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

type FormValues = {
  keyword: string;
  type: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
};

export default function SearchFilter() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    const params = new URLSearchParams(data as any);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap gap-4 justify-center glass-dark p-8 rounded-2xl">
      <input {...register('keyword')} placeholder={t('search.keyword')} className="bg-white/10 text-white placeholder-cream-300 border border-white/20 rounded-xl px-4 py-3 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-gold-500" />
      <select {...register('type')} className="bg-white/10 text-white rounded-xl px-4 py-3 border border-white/20">
        <option value="">{t('search.type')}</option>
        <option value="villa">Villa</option>
        <option value="apartment">Apartment</option>
      </select>
      <input {...register('minPrice')} placeholder={t('search.minPrice')} type="number" className="bg-white/10 text-white placeholder-cream-300 border border-white/20 rounded-xl px-4 py-3 w-32 focus:outline-none focus:ring-2 focus:ring-gold-500" />
      <input {...register('maxPrice')} placeholder={t('search.maxPrice')} type="number" className="bg-white/10 text-white placeholder-cream-300 border border-white/20 rounded-xl px-4 py-3 w-32 focus:outline-none focus:ring-2 focus:ring-gold-500" />
      <input {...register('bedrooms')} placeholder={t('search.bedrooms')} type="number" className="bg-white/10 text-white placeholder-cream-300 border border-white/20 rounded-xl px-4 py-3 w-24 focus:outline-none focus:ring-2 focus:ring-gold-500" />
      <button type="submit" className="btn-primary">{t('search.search')}</button>
    </form>
  );
}