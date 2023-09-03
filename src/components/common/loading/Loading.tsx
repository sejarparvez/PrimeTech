export default function Loading() {
  return (
    <div className="flex gap-8 items-center justify-center">
      <div className="w-12 h-12 rounded-full animate-spin border-4 border-dashed border-green-500 border-t-transparent"></div>
      <div className="w-12 h-12 rounded-full animate-spin border-4 border-dashed border-green-500 border-t-transparent"></div>
      <div className="w-12 h-12 rounded-full animate-spin border-4 border-dashed border-green-500 border-t-transparent"></div>
    </div>
  );
}
