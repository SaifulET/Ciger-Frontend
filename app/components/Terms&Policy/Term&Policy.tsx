import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen p-[16px] md:p-[32px] bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm rounded-lg p-[16px] md:p-[32px] mb-[16px] md:mb-[32px]">
        <h1 className="text-[28px] font-semibold text-gray-900 text-center mb-4">
          Privacy Policy
        </h1>
        <p className="text-gray-600 text-center">
          This Privacy Policy explains how Smokenza (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) collects, uses, discloses, and protects your information when you visit www.smokenza.com (the &quot;Website&quot;) and purchase products or services from us.
        </p>
        <p className="text-gray-600 text-center mt-2">
          By accessing our Website, you consent to the practices described below.
        </p>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm p-[16px] md:p-[32px]">
        <div className="space-y-8">
          {/* Section 1 */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
            <p className="text-gray-600 mb-4">
              We collect information to provide you with a safe, efficient, and personalized shopping experience.
            </p>
            
            <div className="ml-4 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">1.1 Personal Information</h3>
                <p className="text-gray-600 mb-2">When you create an account, place an order, or contact us, we may collect:</p>
                <ul className="text-gray-600 list-disc list-inside space-y-1 ml-4">
                  <li>Full name</li>
                  <li>Billing and shipping address</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                  <li>Date of birth (for age verification)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">1.2 Automatically Collected Information</h3>
                <p className="text-gray-600 mb-2">When you use our Website, we automatically collect:</p>
                <ul className="text-gray-600 list-disc list-inside space-y-1 ml-4">
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Device identifiers</li>
                  <li>Pages viewed</li>
                  <li>Time spent on pages</li>
                  <li>Cookies and tracking technologies</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">1.3 Age Verification Data</h3>
                <p className="text-gray-600 mb-2">To comply with U.S. federal and state laws regarding tobacco and nicotine sales, we may collect and verify:</p>
                <ul className="text-gray-600 list-disc list-inside space-y-1 ml-4">
                  <li>Date of birth</li>
                  <li>Last four digits of SSN (if required by verification agencies)</li>
                  <li>Government-issued ID (verified through secure third-party services)</li>
                </ul>
                <p className="text-gray-600 mt-2 italic">Note: We do not store your ID images or sensitive verification data.</p>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-600 mb-2">We use your information to:</p>
            <ul className="text-gray-600 list-disc list-inside space-y-1 ml-4">
              <li>Process and fulfill orders</li>
              <li>Verify your age and legal eligibility</li>
              <li>Provide customer support</li>
              <li>Improve our Website, services, and product offerings</li>
              <li>Send updates, promotions, or order notifications</li>
              <li>Prevent fraud and maintain Website security</li>
              <li>Comply with legal and regulatory requirements</li>
            </ul>
            <p className="text-gray-600 mt-4">We do not sell your personal information.</p>
          </div>

          {/* Section 3 */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Cookies & Tracking Technologies</h2>
            <p className="text-gray-600 mb-2">We use cookies to:</p>
            <ul className="text-gray-600 list-disc list-inside space-y-1 ml-4">
              <li>Enhance Website performance</li>
              <li>Remember your preferences</li>
              <li>Track usage patterns</li>
              <li>Support secure checkout</li>
              <li>Enable advertising or remarketing (Google, Meta, etc.)</li>
            </ul>
            <p className="text-gray-600 mt-4">
              You can disable cookies in your browser settings, but some Website features may not function properly.
            </p>
          </div>

          {/* Section 4 */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. How We Share Your Information</h2>
            <p className="text-gray-600 mb-4">We may share your information with:</p>
            
            <div className="ml-4 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">4.1 Service Providers</h3>
                <p className="text-gray-600 mb-2">To operate our business, we may share data with:</p>
                <ul className="text-gray-600 list-disc list-inside space-y-1 ml-4">
                  <li>Payment processors</li>
                  <li>Shipping carriers</li>
                  <li>Age verification partners</li>
                  <li>Fraud prevention services</li>
                  <li>Email & SMS marketing platforms</li>
                  <li>Web hosting providers</li>
                </ul>
                <p className="text-gray-600 mt-2">
                  These partners only use your information as needed to perform their services.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">4.2 Legal Requirements</h3>
                <p className="text-gray-600 mb-2">We may disclose information if required by:</p>
                <ul className="text-gray-600 list-disc list-inside space-y-1 ml-4">
                  <li>Law enforcement</li>
                  <li>Court orders</li>
                  <li>Regulatory agencies</li>
                  <li>Applicable federal or state laws</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">4.3 Business Transfers</h3>
                <p className="text-gray-600">
                  If we undergo a merger, acquisition, or asset sale, your information may be transferred as part of the transaction.
                </p>
                <p className="text-gray-600 mt-2">
                  We never sell customer information to third-party marketers.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
            <p className="text-gray-600 mb-2">We take security seriously and use:</p>
            <ul className="text-gray-600 list-disc list-inside space-y-1 ml-4">
              <li>SSL encryption</li>
              <li>Secure payment gateways</li>
              <li>Encrypted databases</li>
              <li>Restricted internal access</li>
              <li>Firewall and malware protection</li>
            </ul>
            <p className="text-gray-600 mt-4">
              While we work hard to protect your data, no online transmission is 100% secure. Please use the Website responsibly.
            </p>
          </div>

          {/* Section 6 */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Age Verification & Restrictions</h2>
            <p className="text-gray-600 mb-4">
              We comply with federal and state regulations requiring all purchasers to be 21 years or older.
            </p>
            <p className="text-gray-600 mb-2">By using our Website, you confirm:</p>
            <ul className="text-gray-600 list-disc list-inside space-y-1 ml-4">
              <li>You are at least 21 years old</li>
              <li>You will not purchase products for minors</li>
              <li>You will comply with local laws regarding tobacco and vape products</li>
            </ul>
            <p className="text-gray-600 mt-4 font-semibold">
              Orders that fail age verification will be canceled.
            </p>
          </div>

          {/* Section 7 */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Your Choices & Rights</h2>
            <p className="text-gray-600 mb-2">
              Depending on your state or country, you may have the right to:
            </p>
            <ul className="text-gray-600 list-disc list-inside space-y-1 ml-4">
              <li>Access your personal information</li>
              <li>Update or correct account details</li>
              <li>Delete your account</li>
              <li>Opt out of marketing emails or texts</li>
              <li>Request details of the data we store</li>
            </ul>
            <p className="text-gray-600 mt-4 font-semibold">
              To make a request, contact us
            </p>
          </div>

          {/* Section 8 */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Retention of Information</h2>
            <p className="text-gray-600 mb-2">
              We retain your information only as long as necessary to:
            </p>
            <ul className="text-gray-600 list-disc list-inside space-y-1 ml-4">
              <li>Fulfill orders</li>
              <li>Provide customer service</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes</li>
              <li>Maintain business records</li>
            </ul>
            <p className="text-gray-600 mt-4">
              Age verification logs may be stored as required by law.
            </p>
          </div>

          {/* Section 9 */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Third-Party Links</h2>
            <p className="text-gray-600 mb-2">
              Our Website may contain links to third-party websites. We are not responsible for their:
            </p>
            <ul className="text-gray-600 list-disc list-inside space-y-1 ml-4">
              <li>Privacy practices</li>
              <li>Security</li>
              <li>Content</li>
              <li>Data usage</li>
            </ul>
            <p className="text-gray-600 mt-4">
              You are encouraged to review their privacy policies independently.
            </p>
          </div>

          {/* Section 10 */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Marketing Communications</h2>
            <p className="text-gray-600 mb-2">
              By providing your email or phone number, you consent to receive:
            </p>
            <ul className="text-gray-600 list-disc list-inside space-y-1 ml-4">
              <li>Order confirmations</li>
              <li>Shipping updates</li>
              <li>Promotions and discounts</li>
              <li>Product news</li>
            </ul>
            <p className="text-gray-600 mt-4">
              You may unsubscribe at any time using the link in any email or by contacting us.
            </p>
          </div>

          {/* Section 11 */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
            <p className="text-gray-600">
              We may update this policy from time to time.
            </p>
            <p className="text-gray-600 mt-2">
              Changes will be posted here with an updated &quot;Last Updated&quot; date.
            </p>
            <p className="text-gray-600 mt-2">
              Continued use of the Website constitutes acceptance of the revised policy.
            </p>
          </div>

          {/* Section 12 */}
          <div className="pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions or concerns regarding this Privacy Policy, please contact us!
            </p>
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Last Updated: November 27, 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;