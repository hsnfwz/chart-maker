const formatCurrency = (amount = 0) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'CAD',
    currencyDisplay: 'code',
  })
    .format(amount)
    .replace('CAD', '')
    .trim();
};

const formatDateTime = (dateTime = new Date()) => {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(new Date(dateTime));
};

const formatDateTimeYear = (dateTime = new Date()) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(dateTime));
};

const formatDateTimeMonth = (dateTime = new Date()) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    timeZone: 'UTC',
  }).format(new Date(dateTime));
};

const formatDateTimeDay = (dateTime = new Date()) => {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(dateTime));
};

const getChartYMax = (data: any) => {
  if (!data || data.length === 0) return 0;

  let max = +data[0].y;
  let i = 0;
  while (i < data.length - 1) {
    const a = +data[i].y;
    const b = +data[i + 1].y;
    if (a < b) {
      max = b;
    }
    i++;
  }

  return max;
};

function isNumeric(string: string) {
  return !isNaN(+string) && !isNaN(parseFloat(string));
}

export {
  formatCurrency,
  formatDateTime,
  formatDateTimeYear,
  formatDateTimeMonth,
  formatDateTimeDay,
  getChartYMax,
  isNumeric,
};