// components/EcryptCardForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  User, 
  Mail, 
  Lock, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Copy,
  Shield
} from 'lucide-react';

interface TokenResponse {
  token: string;
  token_type: 'card' | 'bearer';
  last4?: string;
  expiry_month?: number;
  expiry_year?: number;
  brand?: string;
  expires_in?: number;
  scope?: string;
  error?: string;
}

interface CardFormProps {
  onTokenReceived?: (token: string, tokenData: Omit<TokenResponse, 'token' | 'error'>) => void;
  onError?: (error: string) => void;
  buttonText?: string;
  disabled?: boolean;
  showTokenResult?: boolean;
  directApi?: boolean; // Whether to call eCrypt API directly
}

export const EcryptCardForm: React.FC<CardFormProps> = ({
  onTokenReceived,
  onError,
  buttonText = 'Create Token',
  disabled = false,
  showTokenResult = true,
  directApi = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tokenResult, setTokenResult] = useState<TokenResponse | null>(null);
  
  // Form data matching the curl example exactly
  const [formData, setFormData] = useState({
    name_on_card: '',
    account_number: '',
    expires: '', // MMYY format
    verification_value: '',
    postal_code: '',
    email: '', // Additional field for reference
  });

  // Auto-format expiry date
  useEffect(() => {
    if (formData.expires.length === 4 && !formData.expires.includes('/')) {
      const formatted = `${formData.expires.slice(0, 2)}/${formData.expires.slice(2)}`;
      setFormData(prev => ({ ...prev, expires: formatted }));
    }
  }, [formData.expires]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    switch (name) {
      case 'account_number':
        // Format: 4111 1111 1111 1111
        const formattedNumber = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
        setFormData(prev => ({ ...prev, [name]: formattedNumber.slice(0, 19) }));
        break;
        
      case 'expires':
        // Auto-format to MM/YY
        let formattedExpiry = value.replace(/\D/g, '');
        if (formattedExpiry.length >= 2) {
          formattedExpiry = formattedExpiry.slice(0, 2) + '/' + formattedExpiry.slice(2, 4);
        }
        setFormData(prev => ({ ...prev, [name]: formattedExpiry.slice(0, 5) }));
        break;
        
      case 'verification_value':
        // CVV - max 4 digits
        setFormData(prev => ({ 
          ...prev, 
          [name]: value.replace(/\D/g, '').slice(0, 4) 
        }));
        break;
        
      case 'postal_code':
        // Postal code formatting
        setFormData(prev => ({ 
          ...prev, 
          [name]: value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10) 
        }));
        break;
        
      default:
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const errors: string[] = [];

    // Name validation
    if (!formData.name_on_card.trim()) {
      errors.push('Cardholder name is required');
    }

    // Card number validation (remove spaces)
    const cardNumber = formData.account_number.replace(/\s/g, '');
    if (cardNumber.length < 13 || cardNumber.length > 19) {
      errors.push('Card number must be 13-19 digits');
    }

    // Expiry validation (MM/YY format)
    if (!formData.expires.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      errors.push('Expiry date must be in MM/YY format');
    } else {
      const [month, year] = formData.expires.split('/').map(Number);
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      if (month < 1 || month > 12) {
        errors.push('Invalid month');
      }
      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        errors.push('Card has expired');
      }
    }

    // CVV validation
    if (!formData.verification_value || formData.verification_value.length < 3) {
      errors.push('CVV is required (3-4 digits)');
    }

    // Postal code validation
    if (!formData.postal_code.trim()) {
      errors.push('Postal/ZIP code is required');
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors[0]);
      onError?.(errors[0]);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let result: TokenResponse;

      if (directApi) {
        // ⚠️ WARNING: Direct API call from client requires PCI DSS Level 1 compliance
        // Only use this if you're properly PCI compliant
        result = await callEcryptDirectly();
      } else {
        // ✅ RECOMMENDED: Call your backend API
        result = await callBackendApi();
      }

      if (result.error) {
        throw new Error(result.error);
      }

      // Success
      setTokenResult(result);
      setSuccess(true);
      
      // Callback with token data
      if (onTokenReceived && result.token) {
        onTokenReceived(result.token, {
          token_type: result.token_type || 'card',
          last4: result.last4 || formData.account_number.slice(-4),
          expiry_month: result.expiry_month || parseInt(formData.expires.split('/')[0]),
          expiry_year: result.expiry_year || parseInt('20' + formData.expires.split('/')[1]),
          brand: result.brand,
          expires_in: result.expires_in,
          scope: result.scope,
        });
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Tokenization failed';
      setError(errorMessage);
      onError?.(errorMessage);
      console.error('Tokenization error:', err);
    } finally {
      setLoading(false);
    }
  };

  const callEcryptDirectly = async (): Promise<TokenResponse> => {
    // ⚠️ SECURITY WARNING: Only use this if you have PCI DSS Level 1 compliance
    const apiKey = "A8r3R6-M39Ix5-467stN-VWVbD3";
    
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    const response = await fetch('https://api.ecrypt.com/v1/tokens', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/*+json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        credit_card: {
          name_on_card: formData.name_on_card,
          account_number: formData.account_number.replace(/\s/g, ''),
          expires: formData.expires.replace('/', ''), // MMYY format
          verification_value: formData.verification_value,
          postal_code: formData.postal_code,
        }
      }),
    });
    console.log('Ecrypt API response status:', response);


    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || data.error || 'API request failed');
    }

    return data;
  };

  const callBackendApi = async (): Promise<TokenResponse> => {
    // ✅ Recommended: Send to your secure backend
    const response = await fetch('/api/ecrypt/tokenize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name_on_card: formData.name_on_card,
        account_number: formData.account_number.replace(/\s/g, ''),
        expires: formData.expires.replace('/', ''), // MMYY format
        verification_value: formData.verification_value,
        postal_code: formData.postal_code,
        email: formData.email, // Additional field
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Backend request failed');
    }

    return data;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
      alert('Token copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const clearForm = () => {
    setFormData({
      name_on_card: '',
      account_number: '',
      expires: '',
      verification_value: '',
      postal_code: '',
      email: '',
    });
    setTokenResult(null);
    setSuccess(false);
    setError(null);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Secure Card Tokenization
        </h2>
        <p className="text-gray-600">
          Create a secure token for your payment card
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Cardholder Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <User className="h-4 w-4" />
            Cardholder Name
          </label>
          <input
            type="text"
            name="name_on_card"
            value={formData.name_on_card}
            onChange={handleInputChange}
            placeholder="John Doe"
            required
            disabled={disabled || loading}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 disabled:opacity-50"
          />
        </div>

        {/* Email (Optional) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email (Optional)
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="john@example.com"
            disabled={disabled || loading}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 disabled:opacity-50"
          />
        </div>

        {/* Card Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Card Number
          </label>
          <input
            type="text"
            name="account_number"
            value={formData.account_number}
            onChange={handleInputChange}
            placeholder="4111 1111 1111 1111"
            required
            disabled={disabled || loading}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white font-mono text-lg tracking-wider transition-all duration-200 disabled:opacity-50"
          />
        </div>

        {/* Expiry & CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Expiry Date
            </label>
            <input
              type="text"
              name="expires"
              value={formData.expires}
              onChange={handleInputChange}
              placeholder="MM/YY"
              required
              disabled={disabled || loading}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white font-mono transition-all duration-200 disabled:opacity-50"
            />
            <p className="text-xs text-gray-500 mt-1">Format: MM/YY</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              CVV
            </label>
            <input
              type="text"
              name="verification_value"
              value={formData.verification_value}
              onChange={handleInputChange}
              placeholder="123"
              required
              disabled={disabled || loading}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white font-mono transition-all duration-200 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Postal Code */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Postal / ZIP Code
          </label>
          <input
            type="text"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleInputChange}
            placeholder="90210"
            required
            disabled={disabled || loading}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 disabled:opacity-50"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={disabled || loading}
          className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Creating Token...</span>
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5" />
              <span>{buttonText}</span>
            </>
          )}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success & Token Result */}
      {success && tokenResult && showTokenResult && (
        <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-900">Token Created Successfully!</h3>
              <p className="text-sm text-green-700">Your card has been securely tokenized</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 block">
                Token
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-mono text-gray-800 break-all">
                  {tokenResult.token}
                </code>
                <button
                  onClick={() => copyToClipboard(tokenResult.token)}
                  className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                  title="Copy token"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Card Number</p>
                <p className="font-semibold text-gray-900">•••• {tokenResult.last4 || '0000'}</p>
              </div>
              
              <div className="bg-white/50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Expires</p>
                <p className="font-semibold text-gray-900">
                  {tokenResult.expiry_month?.toString().padStart(2, '0') || '00'}/{tokenResult.expiry_year?.toString().slice(-2) || '00'}
                </p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-green-200 flex justify-between">
              <button
                onClick={clearForm}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Create Another Token
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(JSON.stringify(tokenResult, null, 2))}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium px-3 py-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Copy Full Response
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Shield className="h-5 w-5 text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 mb-1">Security Information</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Card details are encrypted and securely transmitted. We never store your full card information. 
              This token can be used for secure payments without exposing your card details.
            </p>
            {directApi && (
              <p className="text-xs text-red-600 mt-2 font-medium">
                ⚠️ Direct API mode requires PCI DSS Level 1 compliance
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};