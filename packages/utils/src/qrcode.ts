// QR Code generation utilities
import QRCode from 'qrcode';

export async function generateQRCode(data: string): Promise<string> {
  try {
    return await QRCode.toDataURL(data);
  } catch (error) {
    throw new Error('Failed to generate QR code');
  }
}

export async function generateAssetQR(assetCode: string): Promise<string> {
  const data = `VITALOPS:ASSET:${assetCode}`;
  return await generateQRCode(data);
}

export async function generateUpiQR(
  upiId: string,
  merchantName: string,
  amount?: number
): Promise<string> {
  let upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}`;
  
  if (amount) {
    upiString += `&am=${amount}`;
  }
  
  return await generateQRCode(upiString);
}



