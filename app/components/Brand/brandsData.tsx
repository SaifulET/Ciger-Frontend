import api from '@/lib/axios';
import { Brand } from './types';

export interface BrandsData {
  success: boolean;
  count: number;
  data: Brand[];
}

// API service to fetch brands
export async function getBrandsData(): Promise<BrandsData> {
  try {
    const response = await api.get('/brand/getAllBrands');
    const responseData = response.data;
    
    if (!responseData.success) {
      throw new Error('Failed to fetch brands');
    }
    
    return responseData;
  } catch (error) {
    console.error('Error fetching brands:', error);
    return {
      success: false,
      count: 0,
      data: []
    };
  }
}