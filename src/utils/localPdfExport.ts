/**
 * Local PDF Export Utility
 * 
 * Generates PDF reports locally using react-native-html-to-pdf.
 * All PDF generation happens on-device - no server-side rendering.
 * 
 * Features:
 * - Generate trading performance PDF locally
 * - Create HTML template with trade data
 * - Save PDF to local file system
 * - Return file path for sharing via native share dialog
 * 
 * No Network Operations:
 * - No upload to cloud storage
 * - No server-side PDF generation
 * - File remains local until user explicitly shares
 */

import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { Trade, Profile } from '../services/localStorage';

/**
 * Generate HTML content for trade performance PDF
 */
const generateTradeReportHtml = (
  profile: Profile | null,
  trades: Trade[]
): string => {
  // Calculate statistics
  const closedTrades = trades.filter(t => t.exitPrice !== undefined);
  const totalTrades = closedTrades.length;
  
  let totalPnL = 0;
  let wins = 0;
  let losses = 0;

  closedTrades.forEach(trade => {
    if (trade.exitPrice) {
      let pnl: number;
      if (trade.type === 'Long') {
        pnl = (trade.exitPrice - trade.entryPrice) * trade.quantity - trade.fees;
      } else {
        pnl = (trade.entryPrice - trade.exitPrice) * trade.quantity - trade.fees;
      }
      
      totalPnL += pnl;
      if (pnl > 0) wins++;
      else if (pnl < 0) losses++;
    }
  });

  const winRate = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(2) : '0.00';

  // Build HTML
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        h1 {
          color: #2196F3;
          border-bottom: 2px solid #2196F3;
          padding-bottom: 10px;
        }
        h2 {
          color: #1976D2;
          margin-top: 30px;
        }
        .header {
          margin-bottom: 30px;
        }
        .stats {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        .stat-item {
          margin: 10px 0;
          font-size: 16px;
        }
        .stat-label {
          font-weight: bold;
          display: inline-block;
          width: 150px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th {
          background-color: #2196F3;
          color: white;
          padding: 10px;
          text-align: left;
        }
        td {
          padding: 8px;
          border-bottom: 1px solid #ddd;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .positive {
          color: #4CAF50;
          font-weight: bold;
        }
        .negative {
          color: #F44336;
          font-weight: bold;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Trading Performance Report</h1>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        ${profile ? `<p><strong>Trader:</strong> ${profile.name}</p>` : ''}
        ${profile ? `<p><strong>Starting Capital:</strong> ${profile.currency} ${profile.startingCapital.toLocaleString()}</p>` : ''}
      </div>

      <h2>Summary Statistics</h2>
      <div class="stats">
        <div class="stat-item">
          <span class="stat-label">Total Trades:</span>
          <span>${totalTrades}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Total P&L:</span>
          <span class="${totalPnL >= 0 ? 'positive' : 'negative'}">
            ${profile?.currency || '$'} ${totalPnL.toFixed(2)}
          </span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Winning Trades:</span>
          <span class="positive">${wins}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Losing Trades:</span>
          <span class="negative">${losses}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Win Rate:</span>
          <span>${winRate}%</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Open Positions:</span>
          <span>${trades.length - closedTrades.length}</span>
        </div>
      </div>

      <h2>Trade History (Closed Trades)</h2>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Entry</th>
            <th>Exit</th>
            <th>P&L</th>
          </tr>
        </thead>
        <tbody>
          ${closedTrades.map(trade => {
            const pnl = trade.type === 'Long'
              ? ((trade.exitPrice! - trade.entryPrice) * trade.quantity - trade.fees)
              : ((trade.entryPrice - trade.exitPrice!) * trade.quantity - trade.fees);
            
            return `
              <tr>
                <td>${trade.symbol}</td>
                <td>${trade.type}</td>
                <td>${trade.quantity}</td>
                <td>${trade.entryPrice.toFixed(2)}</td>
                <td>${trade.exitPrice!.toFixed(2)}</td>
                <td class="${pnl >= 0 ? 'positive' : 'negative'}">
                  ${pnl.toFixed(2)}
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <div class="footer">
        <p>This report was generated locally on your device.</p>
        <p>All trading data is stored locally and remains private.</p>
      </div>
    </body>
    </html>
  `;

  return html;
};

/**
 * Generate trading performance PDF
 * 
 * @param profile - User profile (optional)
 * @param trades - Array of trades to include
 * @returns Promise with file path to generated PDF
 */
export const generateTradePdf = async (
  profile: Profile | null,
  trades: Trade[]
): Promise<string> => {
  try {
    const html = generateTradeReportHtml(profile, trades);
    
    const options = {
      html,
      fileName: `trading_report_${Date.now()}`,
      directory: 'Documents',
    };

    const file = await RNHTMLtoPDF.convert(options);
    
    if (!file.filePath) {
      throw new Error('PDF generation failed - no file path returned');
    }

    console.log('PDF generated successfully at:', file.filePath);
    return file.filePath;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
};

/**
 * Generate a simple CSV export of trades
 * Alternative to PDF for data export
 * 
 * @param trades - Array of trades to export
 * @returns CSV string
 */
export const generateTradesCsv = (trades: Trade[]): string => {
  const headers = [
    'Symbol',
    'Type',
    'Quantity',
    'Entry Price',
    'Exit Price',
    'Fees',
    'Entry Date',
    'Exit Date',
    'Notes',
  ].join(',');

  const rows = trades.map(trade => {
    return [
      trade.symbol,
      trade.type,
      trade.quantity,
      trade.entryPrice,
      trade.exitPrice || '',
      trade.fees,
      trade.entryDate,
      trade.exitDate || '',
      `"${(trade.notes || '').replace(/"/g, '""')}"`, // Escape quotes in notes
    ].join(',');
  });

  return [headers, ...rows].join('\n');
};

/**
 * Helper to get PDF file name with timestamp
 */
export const getPdfFileName = (): string => {
  const date = new Date();
  const timestamp = date.toISOString().split('T')[0]; // YYYY-MM-DD
  return `trading_report_${timestamp}.pdf`;
};

/**
 * Helper to get CSV file name with timestamp
 */
export const getCsvFileName = (): string => {
  const date = new Date();
  const timestamp = date.toISOString().split('T')[0]; // YYYY-MM-DD
  return `trades_export_${timestamp}.csv`;
};
