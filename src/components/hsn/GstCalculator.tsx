import { useState } from 'react';
import type { HsnResult } from '../../types/chat';

interface GstCalculatorProps {
  result: HsnResult;
  onClose: () => void;
}

export function GstCalculator({ result, onClose }: GstCalculatorProps) {
  const [baseAmount, setBaseAmount] = useState<string>('10000');
  const [isInterState, setIsInterState] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const parsedAmount = Math.max(0, parseFloat(baseAmount) || 0);

  const effectiveIgst = result.igst ?? 0;
  const effectiveCgst = result.cgst ?? (effectiveIgst > 0 ? effectiveIgst / 2 : 0);
  const effectiveSgst = result.sgst ?? (effectiveIgst > 0 ? effectiveIgst / 2 : 0);

  const cgstAmount = isInterState ? 0 : (parsedAmount * effectiveCgst) / 100;
  const sgstAmount = isInterState ? 0 : (parsedAmount * effectiveSgst) / 100;
  const igstAmount = isInterState ? (parsedAmount * effectiveIgst) / 100 : 0;
  const totalTax = isInterState ? igstAmount : cgstAmount + sgstAmount;
  const grandTotal = parsedAmount + totalTax;

  function formatCurrency(val: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(val);
  }

  function handleCopy() {
    const summary = [
      `RAGChatbot GST Estimate for HSN ${result.hsnCode}`,
      `Description: ${result.description}`,
      `Taxable Value: ${formatCurrency(parsedAmount)}`,
      isInterState
        ? `IGST (${effectiveIgst}%): ${formatCurrency(igstAmount)}`
        : `CGST (${effectiveCgst}%): ${formatCurrency(cgstAmount)}\nSGST (${effectiveSgst}%): ${formatCurrency(sgstAmount)}`,
      `Total GST: ${formatCurrency(totalTax)}`,
      `Invoice Total: ${formatCurrency(grandTotal)}`
    ].join('\n');

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="gst-calc">
      <div className="gst-calc__header">
        <div className="gst-calc__title">
          <span className="gst-calc__badge">Interactive Tax Calculator</span>
          <h4>Estimate Invoice for HSN {result.hsnCode}</h4>
        </div>
        <button
          type="button"
          className="gst-calc__close"
          onClick={onClose}
          aria-label="Close calculator"
        >
          ×
        </button>
      </div>

      <div className="gst-calc__body">
        <div className="gst-calc__inputs">
          <div className="gst-calc__field">
            <label htmlFor={`amount-${result.hsnCode}`}>Taxable Base Amount (₹)</label>
            <div className="input-prefix-wrapper">
              <span className="currency-prefix">₹</span>
              <input
                id={`amount-${result.hsnCode}`}
                type="number"
                min="0"
                step="100"
                value={baseAmount}
                onChange={e => setBaseAmount(e.target.value)}
                placeholder="10000"
              />
            </div>
          </div>

          <div className="gst-calc__field">
            <span className="field-label">Transaction Route</span>
            <div className="type-toggle">
              <button
                type="button"
                className={`toggle-btn ${!isInterState ? 'active' : ''}`}
                onClick={() => setIsInterState(false)}
              >
                Intra-State (CGST + SGST)
              </button>
              <button
                type="button"
                className={`toggle-btn ${isInterState ? 'active' : ''}`}
                onClick={() => setIsInterState(true)}
              >
                Inter-State (IGST)
              </button>
            </div>
          </div>
        </div>

        <div className="gst-calc__table">
          <div className="calc-row">
            <span>Taxable Amount</span>
            <strong>{formatCurrency(parsedAmount)}</strong>
          </div>
          {!isInterState ? (
            <>
              <div className="calc-row">
                <span>Central GST (CGST @ {effectiveCgst}%)</span>
                <strong>{formatCurrency(cgstAmount)}</strong>
              </div>
              <div className="calc-row">
                <span>State GST (SGST @ {effectiveSgst}%)</span>
                <strong>{formatCurrency(sgstAmount)}</strong>
              </div>
            </>
          ) : (
            <div className="calc-row">
              <span>Integrated GST (IGST @ {effectiveIgst}%)</span>
              <strong>{formatCurrency(igstAmount)}</strong>
            </div>
          )}
          <div className="calc-row total-row">
            <span>Invoice Total (Amount + Tax)</span>
            <strong className="grand-total">{formatCurrency(grandTotal)}</strong>
          </div>
        </div>

        <div className="gst-calc__actions">
          <button
            type="button"
            className="copy-calc-btn"
            onClick={handleCopy}
          >
            {copied ? '✓ Copied Estimate' : '📋 Copy Tax Breakdown'}
          </button>
        </div>
      </div>
    </div>
  );
}
