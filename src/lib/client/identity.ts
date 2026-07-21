'use client';

import {nanoid} from 'nanoid';

const USER_KEY = 'almaarid-user-key';
const VISITOR_KEY = 'almaarid-visitor-key';

function ensureStorageKey(key: string) {
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const value = `${key}-${nanoid(12)}`;
  localStorage.setItem(key, value);
  return value;
}

export function getUserKey() {
  return ensureStorageKey(USER_KEY);
}

export function getVisitorKey() {
  return ensureStorageKey(VISITOR_KEY);
}
