# Canonical URLs Implementation Guide

## What Are Canonical URLs?

Canonical URLs tell search engines which version of a page is the "main" version when you have duplicate or similar content. This prevents SEO penalties for duplicate content.

## ✅ Implementation Status

### All Pages Now Have Canonical URLs

Your Tara app now has proper canonical tags on every page:

```
https://tara4u.com/                    → Home page
https://tara4u.com/chatlist            → AI Chat page
https://tara4u.com/blogs               → Blog listing
https://tara4u.com/blogs/[slug]        → Individual blog posts
https://tara4u.com/insights            → Mood analytics
https://tara4u.com/journal             → Journaling
https://tara4u.com/profile             → User profile
https://tara4u.com/goals               → Wellness goals
https://tara4u.com/welcome             → Welcome page
https://tara4u.com/onboarding          → Onboarding
https://tara4u.com/privacy-policy      → Privacy policy
https://tara4u.com/terms-of-service    → Terms of service
```

## How It Works

### 1. Root Layout (app/layout.js)
Sets the base canonical URL for the home page:
```javascript
export const metadata = {
  metadataBase: new URL('https://tara4u.com'),
  alternates: {
    canonical: 'https://tara4u.com',
  },
  // ... other metadata
};
```

### 2. Page-Specific Layouts
Each page has its own layout file that sets the canonical URL:

**Example: app/chatlist/layout.js**
```javascript
import { pageMetadata } from '../lib/metadata';

export const metadata = pageMetadata.chatlist;

export default function ChatlistLayout({ children }) {
  return children;
}
```

### 3. Metadata Helper (app/lib/metadata.js)
Centralized metadata configuration with canonical URLs:
```javascript
export const createMetadata = ({
  title,
  description,
  path = '/',
  // ...
}) => {
  const canonicalUrl = `${BASE_URL}${path}`;
  
  return {
    alternates: {
      canonical: canonicalUrl,
    },
    // ... other metadata
  };
};
```

## Rendered HTML Output

When a user visits `/chatlist`, the HTML will include:
```html
<link rel="canonical" href="https://tara4u.com/chatlist" />
```

## Benefits

### 1. SEO Improvements
- ✅ Prevents duplicate content penalties
- ✅ Consolidates link equity to one URL
- ✅ Helps search engines understand your site structure

### 2. Search Engine Clarity
- ✅ Tells Google which version to index
- ✅ Prevents confusion with URL parameters
- ✅ Handles www vs non-www versions

### 3. Better Rankings
- ✅ Stronger page authority
- ✅ Clearer site hierarchy
- ✅ Improved crawl efficiency

## Verification

### Check in Browser DevTools:
1. Open any page on your site
2. Right-click → Inspect
3. Go to `<head>` section
4. Look for: `<link rel="canonical" href="..." />`

### Check in Google Search Console:
1. Go to URL Inspection tool
2. Enter your page URL
3. Check "Canonical URL" section
4. Should show your specified canonical

## Common Issues & Solutions

### Issue 1: Canonical Points to Wrong URL
**Solution**: Update the `path` in `app/lib/metadata.js`

### Issue 2: Missing Canonical on New Page
**Solution**: Create a layout file for the new page:
```javascript
// app/new-page/layout.js
import { pageMetadata } from '../lib/metadata';

export const metadata = {
  alternates: {
    canonical: 'https://tara4u.com/new-page',
  },
  // ... other metadata
};

export default function NewPageLayout({ children }) {
  return children;
}
```

### Issue 3: Canonical Not Showing in HTML
**Solution**: 
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `npm run build`
- Restart dev server: `npm run dev`

## Best Practices

### ✅ DO:
- Use absolute URLs (https://tara4u.com/page)
- Keep canonical URLs consistent
- Point to the preferred version
- Use HTTPS in canonical URLs

### ❌ DON'T:
- Use relative URLs (/page)
- Change canonical URLs frequently
- Point to redirected URLs
- Use different domains

## Testing Checklist

- [ ] All pages have canonical tags
- [ ] Canonical URLs use HTTPS
- [ ] URLs match the actual page URL
- [ ] No broken canonical links
- [ ] Sitemap URLs match canonical URLs

## Monitoring

### Weekly:
- Check Google Search Console for canonical issues
- Review "Duplicate content" warnings

### Monthly:
- Audit all canonical tags
- Verify sitemap matches canonical URLs

## Additional Resources

- [Google's Canonical URL Guide](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Canonical Tag Best Practices](https://moz.com/learn/seo/canonicalization)

---

## Quick Reference

### Add Canonical to New Page:

1. Create layout file: `app/your-page/layout.js`
2. Add metadata:
```javascript
import { createMetadata } from '../lib/metadata';

export const metadata = createMetadata({
  title: 'Your Page Title',
  description: 'Your page description',
  path: '/your-page',
  keywords: ['keyword1', 'keyword2'],
});

export default function YourPageLayout({ children }) {
  return children;
}
```

3. Done! Canonical URL is automatically set to `https://tara4u.com/your-page`

---

**Status**: ✅ All canonical URLs properly implemented
**Last Updated**: November 2024
**Domain**: https://tara4u.com
