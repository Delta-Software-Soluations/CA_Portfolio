require('dotenv').config();
const express = require('express');
const path = require('path');
const os = require('os');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const PORT = process.env.PORT || 3000;
const SITE_URL = (process.env.SITE_URL || `http://localhost:${PORT}`).replace(/\/$/, '');
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const CA_MASK_ID = process.env.CA_MASK_ID?.trim() || '';
const BLOG_ADMIN_USERNAME = process.env.BLOG_ADMIN_USERNAME || '';
const BLOG_ADMIN_PASSWORD = process.env.BLOG_ADMIN_PASSWORD || '';
const supabaseBrowserConfig = SUPABASE_URL && SUPABASE_ANON_KEY ? { url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY } : null;
const supabaseAdmin = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) : null;
const supabaseReadClient = supabaseAdmin || (SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null);
const contactInfo = {
  officeName: 'CA Services - Indore Office',
  streetAddress: 'Plot 12, Scheme No. 54, Vijay Nagar',
  locality: 'Indore',
  region: 'Madhya Pradesh',
  postalCode: '452010',
  country: 'India',
  phone: '+91 98765 43210',
  email: 'info@example.com',
  workingHours: 'Mon-Sat: 10:00 AM - 7:00 PM'
};

const groupIcons = {
  financial: `
    <svg class="icon icon-financial" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 19h16" />
      <path d="M6 17V9" />
      <path d="M11 17V5" />
      <path d="M16 17v-7" />
      <path d="M4.5 14.5 9 10l3 3 5.5-5.5" />
    </svg>
  `,
  taxation: `
    <svg class="icon icon-taxation" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7 4h8l2 2v14H7z" />
      <path d="M15 4v4h4" />
      <path d="M9 11h6" />
      <path d="M9 14h6" />
    </svg>
  `,
  audit: `
    <svg class="icon icon-audit" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
      <path d="m8.5 11 2 2 4-4" />
    </svg>
  `,
  registration: `
    <svg class="icon icon-registration" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 6h14v12H5z" />
      <path d="M8 6V4h8v2" />
      <path d="M8 12h8" />
      <path d="M8 15h5" />
    </svg>
  `,
  ipr: `
    <svg class="icon icon-ipr" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 3a7 7 0 0 0-4.2 12.6V19h8.4v-3.4A7 7 0 0 0 12 3z" />
      <path d="M10 21h4" />
      <path d="M9 14h6" />
      <path d="M9.3 8.5 12 11l2.7-2.5" />
    </svg>
  `,
  advisory: `
    <svg class="icon icon-advisory" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 3a7 7 0 0 0-4 12.8V19h8v-3.2A7 7 0 0 0 12 3z" />
      <path d="M10 21h4" />
      <path d="M9 14h6" />
    </svg>
  `
};

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  res.locals.siteUrl = SITE_URL;
  res.locals.supabase = supabaseBrowserConfig;
  next();
});

const serviceGroups = [
  {
    key: 'financial-services',
    title: 'Financial Services',
    subtitle: 'Planning, funding, reporting, and financial strategy for businesses and individuals.',
    icon: groupIcons.financial,
    items: [
      {
        id: 'financial-services',
        title: 'Financial Services',
        short: 'End-to-end financial support for businesses and individuals.',
        details: 'Practical financial support designed to improve planning, funding, reporting, and long-term decision-making.'
      },
      {
        id: 'financial-consultancy',
        title: 'Financial Consultancy',
        short: 'Strategic advice tailored to your business goals.',
        details: 'Professional consultancy for improving financial structure, operational clarity, and business performance.'
      },
      {
        id: 'loan-funding-assistance',
        title: 'Loan & Funding Assistance',
        short: 'Support in securing finance for growth and expansion.',
        details: 'Assistance with loan applications, funding documentation, lender coordination, and financial presentation.'
      },
      {
        id: 'project-report-cma',
        title: 'Project Report & CMA Data',
        short: 'Detailed project reports and credit analysis data.',
        details: 'Preparation of project reports, CMA data, and financial projections for banks and financial institutions.'
      },
      {
        id: 'investment-planning',
        title: 'Investment Planning',
        short: 'Structured investment strategies aligned with objectives.',
        details: 'Investment planning support to help individuals and businesses allocate capital effectively and manage risk.'
      }
    ]
  },
  {
    key: 'taxation-services',
    title: 'Taxation Services',
    subtitle: 'Income tax, GST, TDS/TCS, and tax advisory services.',
    icon: groupIcons.taxation,
    items: [
      {
        id: 'taxation-services',
        title: 'Taxation Services',
        short: 'Complete tax support for compliance and planning.',
        details: 'Reliable tax advisory to simplify compliance, improve efficiency, and support informed tax decisions.'
      },
      {
        id: 'income-tax-filing',
        title: 'Income Tax (ITR) Filing',
        short: 'Accurate and timely return filing support.',
        details: 'Preparation and filing of income tax returns with attention to compliance, accuracy, and deadlines.'
      },
      {
        id: 'gst-return-filing',
        title: 'GST Registration & Return Filing',
        short: 'GST registration and ongoing return compliance.',
        details: 'End-to-end GST registration, periodic return filing, reconciliations, and compliance guidance.'
      },
      {
        id: 'tds-tcs-filing',
        title: 'TDS / TCS Return Filing',
        short: 'Reliable filing support for deduction compliance.',
        details: 'Timely preparation and filing of TDS and TCS returns with support for notices and reconciliations.'
      },
      {
        id: 'tax-planning',
        title: 'Tax Planning & Consultancy',
        short: 'Practical planning to improve tax efficiency.',
        details: 'Strategic tax planning and advisory to help businesses and individuals structure their obligations better.'
      }
    ]
  },
  {
    key: 'audit-assurance',
    title: 'Audit & Assurance',
    subtitle: 'Independent audit support to improve transparency and control.',
    icon: groupIcons.audit,
    items: [
      {
        id: 'internal-audit',
        title: 'Internal Audit',
        short: 'Controls review and operational assurance.',
        details: 'Independent review of processes, controls, and financial records to improve transparency and compliance.'
      },
      {
        id: 'inventory-audit',
        title: 'Inventory Audit',
        short: 'Verification of inventory records and stock movement.',
        details: 'Audit support to verify inventory accuracy, stock records, and internal controls.'
      },
      {
        id: 'stock-audit',
        title: 'Stock Audit',
        short: 'Detailed review of physical stock and records.',
        details: 'Periodic stock verification to identify variances, improve reporting, and strengthen control systems.'
      },
      {
        id: 'voucher-audit',
        title: 'Voucher Audit',
        short: 'Documentation review for financial assurance.',
        details: 'Checking supporting documents and vouchers to ensure complete, consistent, and compliant records.'
      },
      {
        id: 'concurrent-audit',
        title: 'Concurrent Audit',
        short: 'Ongoing audit support for continuous monitoring.',
        details: 'Real-time audit assistance to monitor transactions, identify risks, and improve control quality.'
      }
    ]
  },
  {
    key: 'registration-compliance',
    title: 'Registration & Compliance',
    subtitle: 'Business registration, statutory filing, and compliance support.',
    icon: groupIcons.registration,
    items: [
      {
        id: 'company-incorporation',
        title: 'Company Incorporation',
        short: 'Smooth registration for new businesses.',
        details: 'Assistance with incorporation filings, documentation, and compliance requirements for new entities.'
      },
      {
        id: 'llp-partnership',
        title: 'LLP / Partnership Registration',
        short: 'Business registration for flexible entity structures.',
        details: 'Registration support for LLPs and partnerships, including document preparation and filing.'
      },
      {
        id: 'msme-iec',
        title: 'MSME & IEC Registration',
        short: 'Registration support for business and trade needs.',
        details: 'Assistance with MSME registration and Import Export Code (IEC) registration for business growth.'
      },
      {
        id: 'roc-mca',
        title: 'ROC & MCA Compliance',
        short: 'Corporate compliance and filing support.',
        details: 'Ongoing support for statutory filings, corporate records, and MCA compliance requirements.'
      },
      {
        id: 'dsc-services',
        title: 'Digital Signature (DSC) Services',
        short: 'DSC procurement and renewal support.',
        details: 'Secure digital signature certificate services for filing, authentication, and online compliance.'
      }
    ]
  },
  {
    key: 'ipr-services',
    title: 'IPR Services',
    subtitle: 'Trademark, certification, and food compliance support for brand protection.',
    icon: groupIcons.ipr,
    items: [
      {
        id: 'trademark',
        title: 'Trademark',
        short: 'Brand protection and trademark registration.',
        details: 'Search, filing, prosecution, and opposition support for trademark protection.'
      },
      {
        id: 'iso',
        title: 'ISO',
        short: 'Process and quality certification support.',
        details: 'ISO documentation, guidance, and certification support for business quality frameworks.'
      },
      {
        id: 'fssai',
        title: 'FSSAI',
        short: 'Food business registration and licensing.',
        details: 'FSSAI registration, licensing, renewals, and compliance support for food businesses.'
      }
    ]
  },
  {
    key: 'business-advisory',
    title: 'Business Advisory',
    subtitle: 'Guidance for setup, compliance management, HR compliance, and financial direction.',
    icon: groupIcons.advisory,
    items: [
      {
        id: 'business-setup',
        title: 'Business Setup Consultancy',
        short: 'Guidance for launching the right business structure.',
        details: 'Consultancy for choosing the correct business model, setup process, and regulatory direction.'
      },
      {
        id: 'compliance-management',
        title: 'Compliance Management',
        short: 'Systematic management of statutory obligations.',
        details: 'Structured compliance monitoring to help businesses meet recurring legal and statutory deadlines.'
      },
      {
        id: 'pf-esic',
        title: 'PF & ESIC Services',
        short: 'Employee welfare compliance support.',
        details: 'Registration, filing, and advisory support for Provident Fund and ESIC compliance requirements.'
      },
      {
        id: 'financial-advisory',
        title: 'Financial Planning & Advisory',
        short: 'Long-term financial direction and decision support.',
        details: 'Advisory services to support budgeting, investment planning, and sustainable financial growth.'
      }
    ]
  }
];

const services = serviceGroups.flatMap(group =>
  group.items.map(item => ({
    ...item,
    category: group.title
  }))
);

const inquiries = [];
const defaultBlogPosts = [
  {
    id: 'tax-planning-for-business-2026',
    title: 'Tax Planning for Businesses in 2026',
    slug: 'tax-planning-for-business-2026',
    summary: 'A practical checklist for improving tax efficiency without creating compliance risk.',
    content: 'Good tax planning starts with clean books, clear turnover tracking, and early review of deductions. For small and mid-sized businesses, the focus should be on quarterly checks, GST reconciliations, and advance tax visibility. A CA can help structure this into a simple monthly routine.',
    category: 'Taxation',
    status: 'Published',
    publishedAt: '2026-06-01T10:00:00.000Z'
  },
  {
    id: 'how-to-prepare-for-audits',
    title: 'How to Prepare for Internal Audits',
    slug: 'how-to-prepare-for-audits',
    summary: 'A short guide to getting records and controls ready before audit review begins.',
    content: 'Internal audits work best when documents, approvals, and reconciliations are already organized. Keep vouchers, stock records, bank statements, and approval trails in one place. A structured pre-audit review reduces last-minute exceptions and speeds up the process.',
    category: 'Audit & Assurance',
    status: 'Published',
    publishedAt: '2026-05-24T10:00:00.000Z'
  },
  {
    id: 'business-registration-checklist',
    title: 'Business Registration Checklist for New Founders',
    slug: 'business-registration-checklist',
    summary: 'The documents and decisions most founders should settle before filing.',
    content: 'Before registration, decide your entity type, verify address documents, and align the tax registrations you will need from day one. LLP, company, partnership, and proprietorship each have different filing needs. The right setup saves time during compliance and future funding discussions.',
    category: 'Registration',
    status: 'Published',
    publishedAt: '2026-05-15T10:00:00.000Z'
  }
];
let blogPosts = defaultBlogPosts.slice();

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || `post-${Date.now()}`;
}

function normalizeBlogPost(entry) {
  const title = String(entry?.title || 'Untitled post').trim();
  const slug = String(entry?.slug || slugify(title)).trim() || slugify(title);
  return {
    id: String(entry?.id || entry?.blog_id || slug),
    title,
    slug,
    summary: String(entry?.summary || entry?.excerpt || '').trim(),
    content: String(entry?.content || '').trim(),
    category: String(entry?.category || 'Blog').trim(),
    status: String(entry?.status || 'Draft').trim(),
    publishedAt: entry?.publishedAt || entry?.published_at || entry?.createdAt || entry?.created_at || new Date().toISOString()
  };
}

function extractBlogRows(result) {
  if (!result) return [];
  if (Array.isArray(result)) return result;
  if (Array.isArray(result.data)) return result.data;
  if (Array.isArray(result.items)) return result.items;
  return [];
}

async function readBlogsFromSource() {
  if (!supabaseReadClient) {
    return blogPosts.slice();
  }

  const { data, error } = await supabaseReadClient.rpc('manage_blogs_json', {
    p_payload: {
      action: 'READ',
      limit: 100,
      offset: 0
    }
  });

  if (error) {
    console.warn('Supabase blog read failed, using local data:', error.message);
    return blogPosts.slice();
  }

  const rows = extractBlogRows(data);
  if (!rows.length) {
    return blogPosts.slice();
  }

  blogPosts = rows.map(normalizeBlogPost);
  return blogPosts.slice();
}

async function saveBlogThroughSource(action, payload) {
  const normalizedPayload = {
    action,
    ...payload
  };

  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin.rpc('manage_blogs_json', {
      p_payload: normalizedPayload
    });

    if (!error && data?.success !== false) {
      await readBlogsFromSource();
      return data || { success: true, message: 'Blog saved.' };
    }

    console.warn('Supabase blog write failed, using local data:', error?.message || data?.message || 'unknown error');
  }

  if (action === 'CREATE') {
    const nextPost = normalizeBlogPost({
      id: payload.id || payload.blog_id || slugify(payload.title),
      title: payload.title,
      slug: payload.slug || slugify(payload.title),
      summary: payload.summary,
      content: payload.content,
      category: payload.category,
      status: payload.status,
      publishedAt: payload.status === 'Published' ? new Date().toISOString() : payload.publishedAt
    });
    blogPosts.unshift(nextPost);
    return { success: true, message: 'Blog created locally.' };
  }

  if (action === 'UPDATE') {
    const targetId = String(payload.blog_id || payload.id || '');
    blogPosts = blogPosts.map(post => {
      if (post.id !== targetId && post.slug !== targetId) return post;
      return normalizeBlogPost({
        ...post,
        ...payload,
        id: post.id,
        slug: payload.slug || post.slug,
        publishedAt: payload.publishedAt || post.publishedAt
      });
    });
    return { success: true, message: 'Blog updated locally.' };
  }

  if (action === 'SOFT_DELETE') {
    const targetId = String(payload.blog_id || payload.id || '');
    blogPosts = blogPosts.filter(post => post.id !== targetId && post.slug !== targetId);
    return { success: true, message: 'Blog deleted locally.' };
  }

  return { success: false, message: 'Unsupported action.' };
}

function requireBlogAdmin(req, res, next) {
  const hasAdminConfig = Boolean(BLOG_ADMIN_USERNAME && BLOG_ADMIN_PASSWORD);
  if (!hasAdminConfig) {
    return res.status(503).send('Blog admin is not configured. Set BLOG_ADMIN_USERNAME and BLOG_ADMIN_PASSWORD in .env.');
  }

  const authHeader = req.headers.authorization || '';
  const [scheme, encoded] = authHeader.split(' ');
  if (scheme !== 'Basic' || !encoded) {
    res.set('WWW-Authenticate', 'Basic realm="Blog Admin"');
    return res.status(401).send('Authentication required');
  }

  const decoded = Buffer.from(encoded, 'base64').toString('utf8');
  const separatorIndex = decoded.indexOf(':');
  const username = separatorIndex >= 0 ? decoded.slice(0, separatorIndex) : '';
  const password = separatorIndex >= 0 ? decoded.slice(separatorIndex + 1) : '';

  if (username !== BLOG_ADMIN_USERNAME || password !== BLOG_ADMIN_PASSWORD) {
    res.set('WWW-Authenticate', 'Basic realm="Blog Admin"');
    return res.status(401).send('Authentication required');
  }

  next();
}

function buildRedirectUrl(targetPath, queryKey, queryValue) {
  const safeTarget = typeof targetPath === 'string' && targetPath.startsWith('/') && !targetPath.includes('://') ? targetPath : '/';
  const [pathPart, hashPart] = safeTarget.split('#');
  const querySeparator = pathPart.includes('?') ? '&' : '?';
  const redirectPath = `${pathPart}${querySeparator}${encodeURIComponent(queryKey)}=${encodeURIComponent(queryValue)}`;
  return hashPart ? `${redirectPath}#${hashPart}` : redirectPath;
}

function buildBlogRedirect(targetPath, queryKey, queryValue) {
  return buildRedirectUrl(targetPath, queryKey, queryValue);
}

app.get('/blogs', async (req, res) => {
  const posts = await readBlogsFromSource();
  const publishedBlogs = posts.filter(post => post.status === 'Published');
  res.render('blogs', {
    siteUrl: SITE_URL,
    blogs: publishedBlogs,
    recentBlogs: publishedBlogs.slice(0, 3)
  });
});

app.get('/blogs/:slug', async (req, res) => {
  const posts = await readBlogsFromSource();
  const post = posts.find(item => item.slug === req.params.slug || item.id === req.params.slug);
  const recentBlogs = posts.filter(item => item.status === 'Published' && item.slug !== req.params.slug).slice(0, 3);

  if (!post || post.status !== 'Published') {
    return res.status(404).render('blog', {
      siteUrl: SITE_URL,
      blog: null,
      recentBlogs
    });
  }

  res.render('blog', {
    siteUrl: SITE_URL,
    blog: post,
    recentBlogs
  });
});

app.get('/admin/blogs', requireBlogAdmin, async (req, res) => {
  const posts = await readBlogsFromSource();
  res.render('admin/blogs', {
    siteUrl: SITE_URL,
    blogs: posts,
    success: req.query.success || '',
    error: req.query.error || '',
    blogAdminConfigured: Boolean(BLOG_ADMIN_USERNAME && BLOG_ADMIN_PASSWORD),
    supabaseConfigured: Boolean(SUPABASE_URL && (SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY))
  });
});

app.post('/admin/blogs/save', requireBlogAdmin, async (req, res) => {
  const { blog_id, title, summary, content, category, status, slug, publishedAt } = req.body;
  if (!title || !content) {
    return res.redirect(buildBlogRedirect('/admin/blogs', 'error', 'Title and content are required.'));
  }

  const action = blog_id ? 'UPDATE' : 'CREATE';
  const result = await saveBlogThroughSource(action, {
    blog_id,
    title,
    summary,
    content,
    category,
    status,
    slug,
    publishedAt
  });

  if (result?.success === false) {
    return res.redirect(buildBlogRedirect('/admin/blogs', 'error', result.message || 'Unable to save blog.'));
  }

  return res.redirect(buildBlogRedirect('/admin/blogs', 'success', result?.message || 'Blog saved.'));
});

app.post('/admin/blogs/delete', requireBlogAdmin, async (req, res) => {
  const { blog_id } = req.body;
  if (!blog_id) {
    return res.redirect(buildBlogRedirect('/admin/blogs', 'error', 'Missing blog id.'));
  }

  const result = await saveBlogThroughSource('SOFT_DELETE', { blog_id });
  if (result?.success === false) {
    return res.redirect(buildBlogRedirect('/admin/blogs', 'error', result.message || 'Unable to delete blog.'));
  }

  return res.redirect(buildBlogRedirect('/admin/blogs', 'success', result?.message || 'Blog removed.'));
});

app.get('/', (req, res) => {
  res.render('index', {
    services,
    serviceGroups,
    siteUrl: SITE_URL,
    submitted: req.query.submitted === '1',
    error: req.query.error === '1',
    errorMsg: req.query.errorMsg || '',
    inquiryCount: inquiries.length,
    recentBlogs: blogPosts.filter(post => post.status === 'Published').slice(0, 3)
  });
});

app.get('/services', (req, res) => {
  res.render('services', { services, serviceGroups, siteUrl: SITE_URL });
});

app.get('/contact', (req, res) => {
  res.render('contact', {
    siteUrl: SITE_URL,
    services,
    contactInfo,
    submitted: req.query.submitted === '1',
    error: req.query.error === '1',
    errorMsg: req.query.errorMsg || '',
    inquiryCount: inquiries.length
  });
});

app.post('/inquiry', (req, res) => {
  (async () => {
    const { name, company, email, phone, service, businessType, message, redirectTo } = req.body;
    const normalizedPhone = String(phone || '').replace(/\D/g, '');

    if (!name || !normalizedPhone) {
      return res.redirect(buildRedirectUrl(redirectTo, 'error', '1'));
    }

    if (normalizedPhone.length !== 10) {
      return res.redirect(buildRedirectUrl(redirectTo, 'errorMsg', 'Phone number must be exactly 10 digits.'));
    }

    if (supabaseAdmin && !CA_MASK_ID) {
      console.warn('Missing CA_MASK_ID: skipping enquiry submission because the payload would be invalid.');
      return res.redirect(buildRedirectUrl(redirectTo, 'errorMsg', 'Server is missing CA_MASK_ID configuration.'));
    }

    const payload = {
      ca_mask_id: CA_MASK_ID,
      name: String(name).trim(),
      contact_number: normalizedPhone,
      email: String(email).trim() || null,
      message: String(message).trim()
    };

    if (!supabaseAdmin) {
      return res.redirect(buildRedirectUrl(redirectTo, 'errorMsg', 'Supabase service role is not configured. Enquiry was not submitted.'));
    }

    try {
      const { data, error } = await supabaseAdmin.rpc('submit_client_enquiry_json', { p_payload: payload });
      if (error) {
        console.warn('Supabase RPC error (submit_client_enquiry_json):', error.message);
        return res.redirect(buildRedirectUrl(redirectTo, 'errorMsg', error.message || 'Supabase RPC error'));
      }

      if (!data || data.success !== true) {
        console.warn('Supabase RPC responded with non-success payload:', data ? JSON.stringify(data) : 'null data');
        return res.redirect(buildRedirectUrl(redirectTo, 'errorMsg', data?.message || 'Submission failed. RPC did not confirm success.'));
      }

      console.log('Inquiry submitted to Supabase RPC:', data);
      return res.redirect(buildRedirectUrl(redirectTo, 'submitted', '1'));
    } catch (err) {
      console.warn('Supabase RPC call failed:', err?.message || err);
      return res.redirect(buildRedirectUrl(redirectTo, 'errorMsg', err?.message || 'Supabase RPC exception'));
    }
  })();
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  // print local network addresses for convenience
  const ifaces = os.networkInterfaces();
  Object.keys(ifaces).forEach(name => {
    ifaces[name].forEach(iface => {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(`Accessible on network: http://${iface.address}:${PORT}`);
      }
    });
  });

  readBlogsFromSource().catch(error => {
    console.warn('Initial blog load failed:', error.message);
  });
});
