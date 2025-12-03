'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface HelpButtonWrapperProps {
  href: string;
  children: ReactNode;
}

export default function HelpButtonWrapper({ href, children }: HelpButtonWrapperProps) {
  return <Link href={href}>{children}</Link>;
}
