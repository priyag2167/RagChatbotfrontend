import { useState } from 'react';
import type { ChatMessage as Message } from '../../types/chat';
import { ResultCard } from '../hsn/ResultCard';
import { FormattedText } from './FormattedText';

export function ChatMessage({ message }: { message: Message }) {
  const [showAllResults, setShowAllResults] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const isUser = message.role === 'user';
  const hasResults = Boolean(message.results && message.results.length > 0);
  const topResult = message.results?.[0];
  const secondaryResults = message.results?.slice(1) || [];

  function copyFullAnswer() {
    let textToCopy = message.text;
    if (topResult) {
      textToCopy += `\n\nPrimary Match:\nHSN Code: ${topResult.hsnCode}\nDescription: ${topResult.description}\nIGST: ${topResult.igst ?? 'N/A'}% | CGST: ${topResult.cgst ?? 'N/A'}% | SGST: ${topResult.sgst ?? 'N/A'}%`;
    }
    navigator.clipboard.writeText(textToCopy);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  }

  return (
    <div className={`message message--${message.role}`}>
      <div className="message__avatar">
        {isUser ? (
          <span className="user-icon">👤</span>
        ) : (
          <span className="bot-mark">RC</span>
        )}
      </div>

      <div className="message__content">
        <div className="message__meta-bar">
          <span className="sender-name">{isUser ? 'You' : 'RAGChatbot Assistant'}</span>
          {message.method && (
            <span className="method-pill">{message.method}</span>
          )}
          {message.timestamp && (
            <span className="message-time">{message.timestamp}</span>
          )}
          {!isUser && (
            <button
              type="button"
              className="copy-summary-btn"
              onClick={copyFullAnswer}
              title="Copy answer to clipboard"
            >
              {copiedSummary ? '✓ Copied' : '📋 Copy'}
            </button>
          )}
        </div>

        <div className="message__body">
          {isUser ? (
            <p className="message__user-text">{message.text}</p>
          ) : (
            <FormattedText content={message.text} />
          )}
        </div>

        {hasResults && topResult && (
          <div className="results-container">
            <div className="results-header">
              <span className="results-header__title">
                Classification Matches ({message.results?.length} records found)
              </span>
              <span className="results-header__hint">
                Ranked by tariff semantic & lexical similarity
              </span>
            </div>

            {/* Featured Primary Match */}
            <ResultCard result={topResult} isFeatured rank={1} />

            {/* Secondary Matches */}
            {secondaryResults.length > 0 && (
              <div className="secondary-results-block">
                <button
                  type="button"
                  className="secondary-toggle-btn"
                  onClick={() => setShowAllResults(prev => !prev)}
                >
                  <span>
                    {showAllResults
                      ? '▲ Hide alternative subheadings'
                      : `▼ View ${secondaryResults.length} other related tariff classifications`}
                  </span>
                  <span className="secondary-count">{secondaryResults.length} more</span>
                </button>

                {showAllResults && (
                  <div className="secondary-results-list">
                    {secondaryResults.map((result, index) => (
                      <ResultCard
                        key={`${result.hsnCode}-${index}`}
                        result={result}
                        rank={index + 2}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {message.disclaimer && (
          <div className="disclaimer-box">
            <span className="disclaimer-icon">⚠️</span>
            <p>{message.disclaimer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
