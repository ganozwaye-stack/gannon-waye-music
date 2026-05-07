// OAuth Token Refresh Middleware — Prevent expiry during long operations
import { base44 } from '@/api/base44Client';

const TOKEN_CACHE = new Map();
const REFRESH_THRESHOLD = 5 * 60 * 1000; // Refresh if < 5 mins left

/**
 * Get fresh Gmail access token
 */
export const getGmailToken = async () => {
  try {
    const { accessToken, expiresIn } = await base44.asServiceRole.connectors.getConnection('gmail');
    
    if (!accessToken) throw new Error('No Gmail token available');
    
    // Cache with expiry tracking
    TOKEN_CACHE.set('gmail', {
      token: accessToken,
      expiresAt: Date.now() + (expiresIn || 3600) * 1000,
    });
    
    return accessToken;
  } catch (error) {
    console.error('Gmail token refresh failed:', error);
    throw error;
  }
};

/**
 * Get fresh Google Sheets access token
 */
export const getGoogleSheetsToken = async () => {
  try {
    const { accessToken, expiresIn } = await base44.asServiceRole.connectors.getConnection('googlesheets');
    
    if (!accessToken) throw new Error('No Google Sheets token available');
    
    TOKEN_CACHE.set('googlesheets', {
      token: accessToken,
      expiresAt: Date.now() + (expiresIn || 3600) * 1000,
    });
    
    return accessToken;
  } catch (error) {
    console.error('Google Sheets token refresh failed:', error);
    throw error;
  }
};

/**
 * Pre-refresh tokens before long operation
 */
export const prefreshAllTokens = async () => {
  try {
    await Promise.all([getGmailToken(), getGoogleSheetsToken()]);
  } catch (error) {
    console.error('Token prerefresh failed:', error);
  }
};

export default { getGmailToken, getGoogleSheetsToken, prefreshAllTokens };