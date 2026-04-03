export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return dateString;
  }
};

export const CATEGORY_STYLES = {
  Food: { bg: 'rgba(239,159,39,0.15)', text: '#EF9F27' },
  Transport: { bg: 'rgba(55,138,221,0.15)', text: '#378ADD' },
  Housing: { bg: 'rgba(127,119,221,0.15)', text: '#7F77DD' },
  Entertainment: { bg: 'rgba(212,83,126,0.15)', text: '#D4537E' },
  Health: { bg: 'rgba(29,158,117,0.15)', text: '#1D9E75' },
  Shopping: { bg: 'rgba(216,90,48,0.15)', text: '#D85A30' },
  Salary: { bg: 'rgba(99,153,34,0.15)', text: '#639922' },
  Freelance: { bg: 'rgba(24,95,165,0.15)', text: '#3b82f6' },
  Investment: { bg: 'rgba(186,117,23,0.15)', text: '#BA7517' },
  Utilities: { bg: 'rgba(156,163,175,0.15)', text: '#9CA3AF' },
  Default: { bg: 'rgba(156,163,175,0.15)', text: '#9CA3AF' }
};