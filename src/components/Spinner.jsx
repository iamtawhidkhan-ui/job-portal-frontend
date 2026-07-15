export default function Spinner({ size = 'md' }) {
  const sizes = { sm: 'w-4 h-4 border-2', md: 'w-8 h-8 border-2', lg: 'w-12 h-12 border-4' };
  return (
    <div className="flex items-center justify-center py-10">
      <div
        className={`${sizes[size]} rounded-full border-brand-200 border-t-brand-600 animate-spin`}
      />
    </div>
  );
}
