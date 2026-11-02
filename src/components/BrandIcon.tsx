import { cn } from '@/lib/utils';

/** Shared document-to-post mark; the surrounding label supplies its name. */
export function BrandIcon({ className }: { className?: string }) {
  return <img src="/logo.svg" alt="" aria-hidden="true" className={cn('h-10 w-10 shrink-0', className)} />;
}
