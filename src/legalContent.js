// Content for the legal page template. Keyed by route slug.
export const LEGAL = {
  terms: {
    title: 'Terms & Conditions',
    updated: 'JAN 01, 2026',
    intro: [
      'This website is operated by Helen Maroulis. Throughout the site, the terms “we”, “us” and “our” refer to Helen Maroulis. Helen Maroulis offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.',
      'Welcome to our website. By accessing or purchasing from this site, you agree to the following Terms & Conditions and acknowledge our Privacy Policy. Please read these sections carefully, as they outline your rights, responsibilities, and how we handle your information when you interact with our store.',
    ],
    sections: [
      { h: 'Use of the Website', p: 'This website and all content provided are intended for personal, non-commercial use. You agree not to misuse the site, interfere with its functionality, or attempt to access secure areas without authorization. We may update or modify these terms at any time, and continued use of the site indicates acceptance of any changes.' },
      { h: 'Product Information', p: 'We make every effort to provide accurate descriptions, images, and specifications for our products. However, slight variations may occur in color, texture, or fit. Availability of products is not guaranteed, and we reserve the right to limit quantities or discontinue items at any time.' },
      { h: 'Pricing & Payment', p: 'All prices are listed in USD unless otherwise stated. We reserve the right to update pricing at any time. Orders are processed once payment is successfully completed. If any issues arise with billing or verification, we may cancel or delay an order.' },
      { h: 'User Conduct', p: 'You acknowledge and agree to use the Website responsibly and in a manner consistent with all applicable laws and regulations. You are solely responsible for your interactions and activities on the Website.' },
      { h: 'Intellectual Property', p: 'All logos, product designs, photos, text, and branding elements are the exclusive property of the company and may not be copied, reproduced, or distributed without written permission.' },
      { h: 'Limitations of Liability', p: 'By using this site and purchasing from us, you agree that the company is not liable for indirect, incidental, or consequential damages related to product use, website performance, or order processing. Athletic performance is individual, and results may vary.' },
    ],
    contact: 'If you have any questions or concerns regarding these Terms, please contact us at contact@helenmaroulis.com',
  },

  privacy: {
    title: 'Privacy Policy',
    updated: 'JAN 01, 2026',
    intro: [
      'This Privacy Policy describes how Helen Maroulis collects, uses, and protects your personal information when you visit or make a purchase from this website.',
      'By using the site, you consent to the practices described below. Please review this policy carefully so you understand how your data is handled.',
    ],
    sections: [
      { h: 'Information We Collect', p: 'We collect information you provide directly, such as your name, email address, shipping address, and payment details, as well as data automatically gathered through cookies and analytics when you browse the site.' },
      { h: 'How We Use Your Information', p: 'Your information is used to process orders, communicate updates, improve our products and services, and, with your consent, send marketing about new drops and releases.' },
      { h: 'Cookies & Tracking', p: 'We use cookies and similar technologies to remember your preferences, analyze traffic, and personalize your experience. You can disable cookies in your browser settings, though some features may not function correctly.' },
      { h: 'Sharing Your Information', p: 'We do not sell your personal information. We share data only with trusted service providers, such as payment processors and shipping carriers, strictly as needed to fulfill your order.' },
      { h: 'Data Security', p: 'We take reasonable measures to protect your information, but no method of transmission over the internet is completely secure. We cannot guarantee absolute security.' },
      { h: 'Your Rights', p: 'You may request access to, correction of, or deletion of your personal data at any time by contacting us. We will respond in accordance with applicable laws.' },
    ],
    contact: 'If you have any questions or concerns regarding this Privacy Policy, please contact us at contact@helenmaroulis.com',
  },

  shipping: {
    title: 'Shipping Policy',
    updated: 'JAN 01, 2026',
    intro: [
      'This Shipping Policy explains how and when your Girl Fight orders are processed, shipped, and delivered.',
      'By placing an order, you agree to the processing times, rates, and conditions outlined below.',
    ],
    sections: [
      { h: 'Processing Times', p: 'Orders are processed within 3–5 business days. Drops and limited releases may require additional processing time, which will be noted at checkout.' },
      { h: 'Shipping Rates & Estimates', p: 'Shipping costs are calculated at checkout based on your location and the items in your cart. Estimated delivery windows are provided but are not guaranteed.' },
      { h: 'Domestic Shipping', p: 'Domestic orders typically arrive within 5–8 business days after processing. You will receive a tracking number once your order ships.' },
      { h: 'International Shipping', p: 'We ship to select international destinations. Customs fees, duties, and taxes are the responsibility of the recipient and are not included in the order total.' },
      { h: 'Lost or Delayed Packages', p: 'We are not responsible for delays caused by the carrier or customs. If your package appears lost, contact us and we will help you investigate with the carrier.' },
    ],
    contact: 'If you have any questions or concerns regarding shipping, please contact us at contact@helenmaroulis.com',
  },

  refund: {
    title: 'Refund Policy',
    updated: 'JAN 01, 2026',
    intro: [
      'This Refund Policy outlines the conditions under which returns, exchanges, and refunds are accepted.',
      'By purchasing from us, you agree to the terms described below.',
    ],
    sections: [
      { h: 'Returns', p: 'We accept returns on unworn, unwashed items in their original condition within 30 days of delivery. Items marked final sale are not eligible for return.' },
      { h: 'Exchanges', p: 'Exchanges are available for a different size or colorway, subject to availability. Contact us to arrange an exchange before sending anything back.' },
      { h: 'Refunds', p: 'Once your return is received and inspected, we will notify you of approval. Approved refunds are issued to your original payment method within 5–10 business days.' },
      { h: 'Non-Refundable Items', p: 'Gift cards, final sale items, and worn or damaged products are not eligible for a refund unless the item arrived defective.' },
      { h: 'Defective or Incorrect Items', p: 'If you received a defective or incorrect item, contact us within 7 days of delivery and we will make it right at no cost to you.' },
    ],
    contact: 'If you have any questions or concerns regarding refunds, please contact us at contact@helenmaroulis.com',
  },
}

export const getLegal = (slug) => LEGAL[slug] || LEGAL.terms
