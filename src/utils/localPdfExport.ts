import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {loadProfile, loadTrades, Profile, Trade} from '../services/localStorage';

/**
 * Local PDF Export Utility
 * 
 * Generates performance reports as PDF files stored locally on the device.
 * No network calls or cloud resources are used.
 * 
 * Note: react-native-html-to-pdf requires native linking:
 * - iOS: cd ios && pod install
 * - Android: Auto-linked (RN 0.60+)
 */

interface PdfOptions {
  fileName?: string;
  directory?: string;
}

/**
 * Build HTML content for the performance report
 */
const buildReportHtml = (profile: Profile | null, trades: Trade[]): string => {
  const totalTrades = trades.length;
  const buyTrades = trades.filter(t => t.type === 'buy').length;
  const sellTrades = trades.filter(t => t.type === 'sell').length;
  
  const totalValue = trades.reduce((sum, trade) => {
    return sum + (trade.price * trade.quantity);
  }, 0);
  
  const totalFees = trades.reduce((sum, trade) => {
    return sum + (trade.fees || 0);
  }, 0);

  const tradesHtml = trades
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(
      trade => `
      <tr>
        <td>${new Date(trade.date).toLocaleDateString()}</td>
        <td>${trade.symbol}</td>
        <td>${trade.type.toUpperCase()}</td>
        <td>${trade.quantity}</td>
        <td>$${trade.price.toFixed(2)}</td>
        <td>$${(trade.fees || 0).toFixed(2)}</td>
        <td>$${(trade.price * trade.quantity).toFixed(2)}</td>
      </tr>
    `,
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Trading Journal Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        h1 {
          color: #1976D2;
          border-bottom: 2px solid #1976D2;
          padding-bottom: 10px;
        }
        h2 {
          color: #424242;
          margin-top: 30px;
        }
        .header-info {
          background: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .stat {
          display: inline-block;
          margin: 10px 20px 10px 0;
        }
        .stat-label {
          font-weight: bold;
          color: #666;
        }
        .stat-value {
          color: #1976D2;
          font-size: 1.2em;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th {
          background: #1976D2;
          color: white;
          padding: 10px;
          text-align: left;
        }
        td {
          padding: 8px;
          border-bottom: 1px solid #ddd;
        }
        tr:hover {
          background: #f9f9f9;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 0.9em;
          color: #666;
          text-align: center;
        }
        .notice {
          background: #FFF3CD;
          border: 1px solid #FFC107;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <h1>Trading Journal Performance Report</h1>
      
      <div class="header-info">
        ${profile ? `<p><strong>Trader:</strong> ${profile.name}</p>` : ''}
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        <p><em>This is a local-only report. No data was transmitted over the network.</em></p>
      </div>

      <div class="notice">
        <strong>Note:</strong> Tax calculations have been removed from this app. 
        Please consult with a tax professional or use specialized tax software for tax reporting.
      </div>

      <h2>Summary Statistics</h2>
      <div class="stat">
        <div class="stat-label">Total Trades:</div>
        <div class="stat-value">${totalTrades}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Buy Trades:</div>
        <div class="stat-value">${buyTrades}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Sell Trades:</div>
        <div class="stat-value">${sellTrades}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Total Value:</div>
        <div class="stat-value">$${totalValue.toFixed(2)}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Total Fees:</div>
        <div class="stat-value">$${totalFees.toFixed(2)}</div>
      </div>

      <h2>Trade History</h2>
      ${
        trades.length > 0
          ? `
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Symbol</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Fees</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${tradesHtml}
        </tbody>
      </table>
      `
          : '<p>No trades recorded yet.</p>'
      }

      <div class="footer">
        <p>Trading Journal - Local-Only Version</p>
        <p>All data stored on device only. Remember to backup your data regularly.</p>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate a PDF report from trade data
 * Returns the local file path of the generated PDF
 */
export const generatePerformancePdf = async (
  options: PdfOptions = {},
): Promise<string> => {
  try {
    // Load local data
    const profile = await loadProfile();
    const trades = await loadTrades();

    // Build HTML content
    const html = buildReportHtml(profile, trades);

    // Generate PDF
    const pdfOptions = {
      html,
      fileName: options.fileName || `trading-report-${Date.now()}`,
      directory: options.directory || 'Documents',
      base64: false,
    };

    const file = await RNHTMLtoPDF.convert(pdfOptions);

    if (!file.filePath) {
      throw new Error('PDF generation failed: No file path returned');
    }

    return file.filePath;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
};

/**
 * Generate and share a PDF report using react-native-share
 * Example usage with react-native-share:
 * 
 * import Share from 'react-native-share';
 * 
 * const filePath = await generatePerformancePdf();
 * await Share.open({
 *   url: `file://${filePath}`,
 *   type: 'application/pdf',
 * });
 */
export const generateAndSharePdf = async (): Promise<void> => {
  try {
    const filePath = await generatePerformancePdf();
    
    // Import Share dynamically to avoid errors if not installed
    const Share = require('react-native-share');
    
    await Share.open({
      url: `file://${filePath}`,
      type: 'application/pdf',
      title: 'Trading Performance Report',
      subject: 'Trading Journal Report',
    });
  } catch (error) {
    console.error('Error sharing PDF:', error);
    throw new Error('Failed to share PDF report');
  }
};
