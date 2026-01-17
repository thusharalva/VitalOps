// Utility functions for generating unique codes
import prisma from './prisma';

/**
 * Generate unique asset code
 * Format: AST-2024-001
 */
export const generateAssetCode = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const prefix = `AST-${year}`;

  // Get the last asset code for this year
  const lastAsset = await prisma.asset.findFirst({
    where: {
      assetCode: {
        startsWith: prefix,
      },
    },
    orderBy: {
      assetCode: 'desc',
    },
  });

  let sequence = 1;
  if (lastAsset) {
    const lastSequence = parseInt(lastAsset.assetCode.split('-')[2]);
    sequence = lastSequence + 1;
  }

  return `${prefix}-${sequence.toString().padStart(3, '0')}`;
};

/**
 * Generate unique rental number
 * Format: RNT-2024-001
 */
export const generateRentalNumber = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const prefix = `RNT-${year}`;

  const lastRental = await prisma.rental.findFirst({
    where: {
      rentalNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      rentalNumber: 'desc',
    },
  });

  let sequence = 1;
  if (lastRental) {
    const lastSequence = parseInt(lastRental.rentalNumber.split('-')[2]);
    sequence = lastSequence + 1;
  }

  return `${prefix}-${sequence.toString().padStart(3, '0')}`;
};

/**
 * Generate unique sale number
 * Format: SAL-2024-001
 */
export const generateSaleNumber = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const prefix = `SAL-${year}`;

  const lastSale = await prisma.sale.findFirst({
    where: {
      saleNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      saleNumber: 'desc',
    },
  });

  let sequence = 1;
  if (lastSale) {
    const lastSequence = parseInt(lastSale.saleNumber.split('-')[2]);
    sequence = lastSequence + 1;
  }

  return `${prefix}-${sequence.toString().padStart(3, '0')}`;
};

/**
 * Generate unique job number
 * Format: JOB-2024-001
 */
export const generateJobNumber = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const prefix = `JOB-${year}`;

  const lastJob = await prisma.job.findFirst({
    where: {
      jobNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      jobNumber: 'desc',
    },
  });

  let sequence = 1;
  if (lastJob) {
    const lastSequence = parseInt(lastJob.jobNumber.split('-')[2]);
    sequence = lastSequence + 1;
  }

  return `${prefix}-${sequence.toString().padStart(3, '0')}`;
};

/**
 * Generate unique invoice number
 * Format: INV-2024-001
 */
export const generateInvoiceNumber = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const prefix = `INV-${year}`;

  const lastInvoice = await prisma.invoice.findFirst({
    where: {
      invoiceNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      invoiceNumber: 'desc',
    },
  });

  let sequence = 1;
  if (lastInvoice) {
    const lastSequence = parseInt(lastInvoice.invoiceNumber.split('-')[2]);
    sequence = lastSequence + 1;
  }

  return `${prefix}-${sequence.toString().padStart(3, '0')}`;
};

/**
 * Generate unique payment number
 * Format: PAY-2024-001
 */
export const generatePaymentNumber = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const prefix = `PAY-${year}`;

  const lastPayment = await prisma.payment.findFirst({
    where: {
      paymentNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      paymentNumber: 'desc',
    },
  });

  let sequence = 1;
  if (lastPayment) {
    const lastSequence = parseInt(lastPayment.paymentNumber.split('-')[2]);
    sequence = lastSequence + 1;
  }

  return `${prefix}-${sequence.toString().padStart(3, '0')}`;
};

/**
 * Generate unique sleep study number
 * Format: SLP-2024-001
 */
export const generateSleepStudyNumber = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const prefix = `SLP-${year}`;

  const lastStudy = await prisma.sleepStudy.findFirst({
    where: {
      studyNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      studyNumber: 'desc',
    },
  });

  let sequence = 1;
  if (lastStudy) {
    const lastSequence = parseInt(lastStudy.studyNumber.split('-')[2]);
    sequence = lastSequence + 1;
  }

  return `${prefix}-${sequence.toString().padStart(3, '0')}`;
};



