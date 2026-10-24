import type { CategoryPreset } from '../types/chat';

export const CATEGORY_PRESETS: CategoryPreset[] = [
  { label: 'Textiles & Garments', icon: '👕', query: 'cotton t-shirt' },
  { label: 'IT & Electronics', icon: '💻', query: 'laptop computer' },
  { label: 'Food & Dairy', icon: '🥛', query: 'fresh milk and cream' },
  { label: 'Toys & Robotics', icon: '🤖', query: 'robotic toy animal' },
  { label: 'Automotive Parts', icon: '🚗', query: 'motor vehicle spark plug' },
  { label: 'Live Animals', icon: '🐎', query: '01011010' }
];

export const SUGGESTED_CHIPS: string[] = [
  'cotton t-shirt',
  'robotic toy animal',
  'wooden furniture',
  'laptop computer',
  '01011010',
  'mobile phone cover'
];

export const INITIAL_WELCOME_MESSAGE: string = `### Welcome to RAGChatbot HSN & GST Intelligence
I am your dedicated classification assistant grounded directly in the official Indian Goods and Services Tax (GST) tariff schedule.

- Enter any **product name, material, or keyword** to find the most accurate HSN/SAC code.
- Or enter a **2, 4, 6, or 8-digit HSN code** directly to inspect applicable CGST, SGST, and IGST rates.
- Use the **interactive tax calculator** on any result to estimate actual tax on your invoice amount.`;
