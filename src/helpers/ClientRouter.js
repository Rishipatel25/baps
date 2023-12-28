'use client';
import { ROUTES } from '@/utils/constants/routes.constants';
export function ClientRouter(routePath = ROUTES.BASE) {
  window.location.href = process.env.NEXT_PUBLIC_BASEPATH + routePath;
}
