import React, { useState } from 'react';
import { User } from 'lucide-react';

interface UserAvatarProps {
  src?: string | null;
  alt?: string;
  className?: string;
  iconClassName?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  alt = '프로필',
  className = 'w-8 h-8',
  iconClassName = 'w-1/2 h-1/2 text-[#64748B]',
}) => {
  const [hasError, setHasError] = useState(false);
  const trimmedSrc = (src || '').trim();

  if (trimmedSrc && !hasError) {
    return (
      <img
        src={trimmedSrc}
        alt={alt}
        onError={() => setHasError(true)}
        className={`rounded-full object-cover shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`rounded-full bg-[#E2E8F0] text-[#64748B] flex items-center justify-center shrink-0 overflow-hidden ${className}`}
      aria-label={alt}
      title={alt}
    >
      <User className={iconClassName} />
    </div>
  );
};
