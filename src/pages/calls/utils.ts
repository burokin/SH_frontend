import React from 'react';

export function highlight(text: string, search: string) {
  if (!search) return text;
  const regex = new RegExp(
    '(' + search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')',
    'gi'
  );
  return text
    .split(regex)
    .map((part, i) =>
      regex.test(part)
        ? React.createElement(
            'span',
            { key: i, style: { background: 'yellow' } },
            part
          )
        : part
    );
}
