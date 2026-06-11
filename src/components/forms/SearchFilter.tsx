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
      <input {...register('keyword')} placeholder={t('search.keyword')} className="input-field w-full sm:w-auto" />
      <select {...register('type')} className="input-field">
        <option value="">{t('search.type')}</option>
        <option value="villa">Villa</option>
        <option value="apartment">Apartment</option>
      </select>
      <input {...register('minPrice')} placeholder={t('search.minPrice')} type="number" className="input-field w-32" />
      <input {...register('maxPrice')} placeholder={t('search.maxPrice')} type="number" className="input-field w-32" />
      <input {...register('bedrooms')} placeholder={t('search.bedrooms')} type="number" className="input-field w-24" />
      <button type="submit" className="btn-primary">{t('search.search')}</button>
    </form>
  );
}