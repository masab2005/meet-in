'use client'
import React, { useState } from 'react';
export default function Avatar({ src, name }: { src?: string | null; name?: string | null }) {
  const [imgFailed, setImgFailed] = useState(false);
  const initial = name?.[0]?.toUpperCase() ?? '?';

  return (
    <div className="relative">
      {/* image if available and not failed */}
      {src && !imgFailed ? (
        <img
          src={src}
          alt={name ?? 'User'}
          onError={() => setImgFailed(true)}
          className="w-10 h-10 rounded-full object-cover shadow-[inset_2px_2px_4px_rgba(0,0,0,0.06)]"
        />
      ) : (
        /* fallback initial */
        <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center">
          <span className="text-amber-800 font-semibold text-sm">{initial}</span>
        </div>
      )}

    </div>
  );
}
