import React from "react";

function TermsAndConditions() {
  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm rounded-lg p-4 md:p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Terms and Conditions
        </h1>
      </div>

      {/* Content */}
      <div className="bg-white shadow-sm rounded-lg p-[32px] space-y-6 text-gray-800 leading-relaxed">
        {/* Introduction */}
        <section>
          <p className="text-base md:text-lg md:text-center">
            Welcome to <strong>Smokenza</strong> (“Company,” “we,” “us,” or
            “our”). These Terms & Conditions (“Terms”) govern your access to and
            use of our website, products, and services available at{" "}
            <strong>www.smokenza.com</strong> (the “Site”).
          </p>
          <p className="mt-3 text-base md:text-lg md:text-center">
            By accessing or using this Site, you agree to be legally bound by
            these Terms. If you do not agree, you must not use this Site.
          </p>
        </section>

        {/* 1. AGE RESTRICTION */}
        <section>
          <h2 className="text-xl font-semibold">
            1. AGE RESTRICTION & LEGAL COMPLIANCE
          </h2>
          <p className="mt-3 text-base md:text-lg">
            Smokenza sells products that are strictly restricted to adults.
          </p>
          <ul className="list-disc ml-5 mt-3 space-y-1.5 text-sm md:text-base">
            <li>
              You must be at least 21 years of age (or the minimum legal age in
              your jurisdiction, whichever is higher) to access or purchase from
              this Site.
            </li>
            <li>
              By using this Site, you affirm and verify that you are legally
              permitted to purchase tobacco and/or vape products.
            </li>
            <li>
              We utilize age-verification systems and reserve the right to
              request additional proof of age at any time.
            </li>
            <li>
              Any attempt to falsify age information will result in immediate
              account termination and order cancellation without refund.
            </li>
          </ul>
        </section>

        {/* 2. PRODUCTS SOLD */}
        <section>
          <h2 className="text-xl font-semibold">2. PRODUCTS SOLD</h2>
          <p className="mt-3 text-base md:text-lg">
            Smokenza may sell, but is not limited to:
          </p>
          <ul className="list-disc ml-5 mt-3 space-y-1.5 text-sm md:text-base">
            <li>Premium handmade cigars</li>
            <li>Machine-made cigars and cigarillos</li>
            <li>Pipe tobacco and smokeless tobacco</li>
            <li>Vape devices, disposables, and accessories</li>
            <li>Smoking accessories and lifestyle products</li>
          </ul>
          <p className="mt-4 font-semibold text-base md:text-lg">
            Health Disclaimer:
          </p>
          <p className="mt-1.5 text-sm md:text-base">
            Tobacco and nicotine products contain nicotine, an addictive
            chemical. These products are not safe and may cause serious health
            risks. By purchasing, you acknowledge and accept all associated
            risks.
          </p>
        </section>

        {/* 3. ACCOUNT REGISTRATION */}
        <section>
          <h2 className="text-xl font-semibold">3. ACCOUNT REGISTRATION</h2>
          <p className="mt-3 text-sm md:text-base">
            To place an order, you may be required to create an account. You
            agree to:
          </p>
          <ul className="list-disc ml-5 mt-3 space-y-1.5 text-sm md:text-base">
            <li>Provide accurate and complete information</li>
            <li>Maintain confidentiality of your login credentials</li>
            <li>Accept responsibility for all activities under your account</li>
          </ul>
          <p className="mt-3 text-sm md:text-base">
            We reserve the right to suspend or terminate accounts suspected of
            fraud, abuse, or violation of these Terms.
          </p>
        </section>

        {/* 4. ORDER ACCEPTANCE */}
        <section>
          <h2 className="text-xl font-semibold">
            4. ORDER ACCEPTANCE & CANCELLATION
          </h2>
          <p className="mt-3 text-sm md:text-base">
            All orders are subject to acceptance by Smokenza.
          </p>
          <p className="mt-3 text-sm md:text-base">
            We reserve the right to cancel or refuse any order for any reason,
            including but not limited to:
          </p>
          <ul className="list-disc ml-5 mt-3 space-y-1.5 text-sm md:text-base">
            <li>Failed age verification</li>
            <li>Pricing or inventory errors</li>
            <li>Suspected fraud</li>
            <li>Regulatory restrictions</li>
          </ul>
          <p className="mt-3 text-sm md:text-base">
            If an order is canceled after payment, a refund will be issued to
            the original payment method.
          </p>
        </section>

        {/* 5. PAYMENT */}
        <section>
          <h2 className="text-xl font-semibold">5. PRICING & PAYMENT</h2>
          <ul className="list-disc ml-5 mt-3 space-y-1.5 text-sm md:text-base">
            <li>
              All prices are listed in U.S. Dollars (USD) unless otherwise
              stated.
            </li>
            <li>Prices may change at any time without notice.</li>
            <li>
              You are responsible for all applicable taxes, excise duties, and
              fees imposed by your state or locality
            </li>
            <li>Accepted payment methods are displayed at checkout.</li>
          </ul>
          <p className="mt-3 text-sm md:text-base">
            Smokenza does not accept payments on behalf of minors or third
            parties.
          </p>
        </section>

        {/* 6. SHIPPING */}
        <section>
          <h2 className="text-xl font-semibold">6. SHIPPING & DELIVERY</h2>
          <ul className="list-disc ml-5 mt-3 space-y-1.5 text-sm md:text-base">
            <li>
              We ship only to locations where our products are legal to sell and
              receive.
            </li>
            <li>Adult signature may be required upon delivery.</li>
            <li className="mt-3 text-sm md:text-base">
              We are not responsible for:
              <ul className="list-disc ml-5 mt-3 space-y-1.5 text-sm md:text-base">
                <li>Delays caused by carriers</li>
                <li>Seized or confiscated packages due to local laws</li>
                <li>Incorrect addresses provided by the customer</li>
              </ul>{" "}
            </li>
            <li className="mt-3 text-sm md:text-base">
              Title and risk of loss pass to you upon delivery to the carrier.
            </li>
          </ul>
        </section>

        {/* 7. RETURNS */}
        <section>
          <h2 className="text-xl font-semibold">
            7. RETURNS, REFUNDS & EXCHANGES
          </h2>
          <p>Due to the nature of tobacco and vape products:</p>
          <ul className="list-disc ml-5 mt-3 space-y-1.5 text-sm md:text-base">
            <li>All sales are final</li>
            <li>
              We do not accept returns or exchanges on tobacco, vape, or
              consumable products
            </li>
            <li>
              Refunds may be issued only if:
              <ul className="list-disc ml-5 mt-3 space-y-1.5 text-sm md:text-base">
                <li>Items are damaged during shipping</li>
                <li>he wrong product was shipped</li>
              </ul>
            </li>
          </ul>
        </section>

        {/* 8. TAXES */}
        <section>
          <h2 className="text-xl font-semibold">
            8. TAXES & REGULATORY COMPLIANCE
          </h2>
          <ul className="list-disc ml-5 mt-3 space-y-1.5 text-sm md:text-base">
            <li className="mt-3 text-sm md:text-base">
              Customers are responsible for understanding and complying with
              their local and state tobacco <b>laws.</b>
            </li>
            <li className="mt-1.5 text-sm md:text-base">
              Smokenza complies with applicable federal regulations including,
              but not limited to:
              <ul className="list-disc ml-5 mt-3 space-y-1.5 text-sm md:text-base">
                <li>PACT Act (where applicable)</li>
                <li>State excise tax requirements</li>
              </ul>
            </li>
            <li>
              We reserve the right to restrict shipments to certain states or
              jurisdictions.
            </li>
          </ul>
        </section>

        {/* 9–17. STANDARD LEGAL SECTIONS */}
        <section>
          <h2 className="text-xl font-semibold">9. INTELLECTUAL PROPERTY</h2>
          <p className="mt-3 text-sm md:text-base">
            All content on this Site—including text, images, logos, product
            descriptions, graphics, and branding—is the exclusive property of{" "}
            <b>Smokenza</b> and protected under U.S. and international
            copyright, trademark, and intellectual property laws
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">10. PROHIBITED USES</h2>
          <p className="mt-3 text-sm md:text-base">You agree not to:</p>
          <ul className="list-disc ml-5 mt-3 space-y-1.5 text-sm md:text-base">
            <li>Use the Site for illegal purposes</li>
            <li>Attempt to bypass age verificatio</li>
            <li>Engage in fraud or misrepresentation</li>
            <li>Scrape, crawl, or data-mine the Site</li>
            <li>Interfere with Site security or functionality</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">
            11. DISCLAIMER OF WARRANTIES
          </h2>
          <p className="mt-3 text-sm md:text-base">
            All products and services are provided <b>“AS IS”</b> and{" "}
            <b>“AS AVAILABLE.”</b>
          </p>
          <p className="mt-3 text-sm md:text-base">
            Smokenza makes no warranties, express or implied, including but not
            limited to:
          </p>
          <ul className="list-disc ml-5 mt-3 space-y-1.5 text-sm md:text-base">
            <li>Merchantability</li>
            <li>Fitness for a particular purpose</li>
            <li>Non-infringement</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">12. LIMITATION OF LIABILITY</h2>
          <p className="mt-3 text-sm md:text-base">
            To the maximum extent permitted by law, Smokenza shall not be liable
            for:
            <ul className="list-disc ml-5 mt-3 space-y-1.5 text-sm md:text-base">
              <li>Personal injury or health effects</li>
              <li>Indirect, incidental, or consequential damages</li>
              <li>Loss of profits or data</li>
              <li>Delays or delivery failures</li>
            </ul>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">13. INDEMNIFICATION</h2>
          <p className="mt-3 text-sm md:text-base">
            You agree to indemnify and hold harmless Smokenza, its owners,
            officers, employees, and affiliates from any claims, damages,
            liabilities, or expenses arising from:
            <ul className="list-disc ml-5 mt-3 space-y-1.5 text-sm md:text-base">
              <li>Your misuse of the Site</li>
              <li>Violation of these Terms</li>
              <li>Violation of any law or regulation</li>
            </ul>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">14. TERMINATION</h2>
          <p className="mt-3 text-sm md:text-base">
           We reserve the right to terminate or restrict access to the Site or your account at any time, without notice, for violation of these Terms.

          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">15. GOVERNING LAW</h2>
          <p className="mt-3 text-sm md:text-base">
           These Terms are governed by and construed in accordance with the laws of the State of Illinois, without regard to conflict-of-law principles.

          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">16. DISPUTE RESOLUTION</h2>
          <p className="mt-3 text-sm md:text-base">
         Any dispute arising from these Terms or use of the Site shall be resolved through:
<ul className="list-disc ml-5 mt-3 space-y-1.5 text-sm md:text-base">
  <li>Binding arbitration or
</li>
  <li>Courts located in Illinois, at our sole discretion</li>
  
</ul>
          </p>
          <p>

You waive the right to participate in class actions
</p>

        </section>

        <section>
          <h2 className="text-xl font-semibold">17. CHANGES TO TERMS</h2>
          <p className="mt-3 text-sm md:text-base">
            We may update these Terms at any time. Continued use of the Site after changes constitutes acceptance of the revised Terms.

          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">18. CONTACT INFORMATION</h2>
          <p className="mt-3 text-sm md:text-base">
           For questions or legal inquiries, contact: support@smokenza.com

          </p>
        </section>

        {/* State Restrictions */}
        <section>
          <h2 className="text-xl font-semibold">
            State & Shipping Restrictions
          </h2>
          <p className="mt-3 text-sm md:text-base">
            Due to federal and state regulations, certain states and territories
            cannot receive vape shipments.
          </p>
          <p className="mt-3 font-semibold text-base md:text-lg">
            Restricted States:
          </p>
          <ul className="list-disc ml-5 mt-2 space-y-1.5 text-sm md:text-base">
            <li>Alaska</li>
            <li>Arkansas</li>
            <li>Connecticut</li>
            <li>Colorado</li>
            <li>Georgia</li>
            <li>Hawaii</li>
            <li>Maine</li>
            <li>Nebraska</li>
            <li>New Hampshire</li>
            <li>New York</li>
            <li>North Carolina</li>
            <li>Ohio</li>
            <li>Oregon</li>
            <li>South Carolina</li>
            <li>South Dakota</li>
            <li>Utah</li>
            <li>Vermont</li>
          </ul>
          <p className="mt-3 font-semibold text-base md:text-lg">
            Restricted U.S. Territories:
          </p>
          <ul className="list-disc ml-5 mt-2 space-y-1.5 text-sm md:text-base">
            <li>Guam</li>
            <li>North Marianas</li>
            <li>American Samoa</li>
            <li>Puerto Rico</li>
            <li>U.S. Virgin Islands</li>
          </ul>
        </section>

        <p className="text-semibold text-gray-600 mt-6 text-2xl">
          Updated December 4th 2025
        </p>

        <section className="mt-4">
          <p className="text-sm md:text-base">
            As a result of the PACT Act, USPS can no longer ship vaping
            products. Please read our{" "}
            <a
              href="https://www.electrictobacconist.com/usps-vape-mail-ban-i285"
              className="underline text-blue-500"
            >
              Vape Mail Ban
            </a>{" "}
            page for more information. Smokenza complies with all federal and
            state-specific laws and regulations. Please see below for a list of
            state-based restrictions related to vaping products.
          </p>

          {/* States we cannot ship to */}
          <h3 className="text-base font-semibold mt-3">
            We are currently unable to ship to the following states:
          </h3>
          <ul className="list-disc ml-5 mt-2 space-y-1.5 text-sm md:text-base">
            <li>Alaska</li>
            <li>Arkansas</li>
            <li>Connecticut</li>
            <li>Colorado</li>
            <li>Georgia</li>
            <li>Hawaii</li>
            <li>Maine</li>
            <li>Nebraska</li>
            <li>New Hampshire</li>
            <li>New York</li>
            <li>North Carolina</li>
            <li>Ohio</li>
            <li>Oregon</li>
            <li>South Carolina</li>
            <li>South Dakota</li>
            <li>Utah</li>
            <li>Vermont</li>
          </ul>

          {/* Territories */}
          <h3 className="text-base font-semibold mt-3">
            We are also unable to ship to U.S. territories:
          </h3>
          <ul className="list-disc ml-5 mt-2 space-y-1.5 text-sm md:text-base">
            <li>Guam</li>
            <li>North Marianas</li>
            <li>American Samoa</li>
            <li>Puerto Rico</li>
            <li>U.S. Virgin Islands</li>
          </ul>

          <p className="mt-2 text-sm md:text-base">
            We cannot ship to APO/FPO/AE military addresses.
          </p>

          {/* Brand restricted states */}
          <h3 className="text-base font-semibold mt-3">
            States allowing only certain brands (JUUL, blu, VUSE, NJOY & Logic):
          </h3>
          <ul className="list-disc ml-5 mt-2 space-y-1.5 text-sm md:text-base">
            <li>Arizona</li>
            <li>California (excluding blu)</li>
            <li>Connecticut</li>
            <li>Delaware</li>
            <li>DC</li>
            <li>Illinois</li>
            <li>Indiana</li>
            <li>Maryland</li>
            <li>Massachusetts</li>
            <li>Michigan</li>
            <li>Minnesota</li>
            <li>Nevada</li>
            <li>New Jersey</li>
            <li>New Mexico</li>
            <li>Pennsylvania</li>
            <li>Rhode Island</li>
            <li>Virginia</li>
            <li>Washington</li>
            <li>Wisconsin</li>
          </ul>

          {/* Discounts / coupons restrictions */}
          <h3 className="text-base font-semibold mt-3">
            States/Cities prohibiting discounts or coupons:
          </h3>
          <ul className="list-disc ml-5 mt-2 space-y-1.5 text-sm md:text-base">
            <li>Massachusetts</li>
            <li>New Jersey</li>
          </ul>

          {/* Additional restrictions */}
          <h3 className="text-base font-semibold mt-3">
            Additional Restrictions and Flavor Bans:
          </h3>

          <div className=" mt-2 space-y-1.5 text-sm md:text-base">
            <p>
              Alabama has banned all tobacco-free (synthetic) nicotine products.
            </p>
            <p>
              California has banned the sale of flavored e-liquid products,
              including menthol.
            </p>
            <p>
              Illinois has restricted the sale of products from brands that have
              received a PMTA Marketing Denial Order (MDO) from the FDA. See the{" "}
              <a
                href="https://www.fda.gov/tobacco-products/market-and-distribute-tobacco-product/tobacco-products-marketing-orders#Marketing%20Denial"
                className="underline text-blue-500"
                target="_blank"
              >
                FDA&apos;s Tobacco Products Marketing Orders page
              </a>{" "}
              for more information. We also no longer ship to Chicago, IL.
            </p>
            <p>
              Massachusetts has a temporary ban on flavored nicotine products
              and any product over 35mg.
            </p>
            <p>Maryland has banned flavored disposables.</p>
            <p>
              Minnesota has limited the sale of products into the state to those
              that have received a PMTA Marketing Granted Order. Please visit{" "}
              <a
                href="https://www.electrictobacconist.com/fda-premarket-tobacco-product-marketing-granted-orders"
                className="underline text-blue-500"
                target="_blank"
              >
                the FDA Marketing Granted Orders page
              </a>{" "}
              for additional information.
            </p>
            <p>
              New Jersey has banned flavored nicotine products, including
              menthol and nicotine-free items (excluding tobacco).
            </p>
            <p>
              New York prohibits online sales of vaping products containing
              liquid.
            </p>
            <p>
              Philadelphia, PA, has banned flavored nicotine products (except
              nicotine-free liquid). It also bans online sales of nicotine-salt
              e-liquid.
            </p>
            <p>
              San Francisco, CA, has banned the sale of all vaping products.
            </p>
            <p>
              Wisconsin has limited sales to products listed on the{" "}
              <a
                href="https://www.revenue.wi.gov/Pages/OnlineServices/electronic-vaping-device-directory.aspx#"
                target="_blank"
                className="text-blue-500 underline"
              >
                Wisconsin Electronic Vaping Device Directory.
              </a>
            </p>
          </div>

          {/* Flavor bans */}
          <h3 className="text-base font-semibold mt-4">
            Flavored vape bans enacted in these states/cities:
          </h3>
          <ul className="list-disc ml-5 mt-2 space-y-1.5 text-sm md:text-base">
            <li>Aspen,Colorado**</li>
            <li>Boulder, Colorado*</li>
            <li>Carbondale, Colorado</li>
            <li>California*</li>
            <li>Rhode Island*</li>
          </ul>
          <p className="mt-1 text-xs md:text-sm text-gray-600">
            *Includes menthol
          </p>

          <p className="mt-3 text-sm md:text-base">
            Please note: Due to Proposition EE, we have temporarily suspended
            sales to all cities in Colorado.
          </p>

          <p className="mt-3 text-sm md:text-base">
            If you are in California, you will receive a phone call from us
            after 5 PM to confirm your order.
          </p>
          <p className="mt-3 text-sm md:text-base">
            If you have any questions, please reach out to us for more
            information.
          </p>

          <p className="mt-3 text-sm md:text-base">
            Flavored products are defined as any product that is not "tobacco"
            flavored. If your state/locality restricts a product you attempt to
            purchase, checkout will prevent the order until the item is removed.
          </p>
        </section>
      </div>
    </div>
  );
}

export default TermsAndConditions;
