import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Environment variables
  const API_KEY = process.env.REACT_APP_AIRTABLE_API_KEY;
  const BASE_ID = process.env.REACT_APP_AIRTABLE_BASE_ID ||;
  const TABLE_NAME = process.env.REACT_APP_AIRTABLE_TABLE_NAME ||;

  const handleSearch = async () => {
    if (!query.trim()) {
      setResult({ error: 'Please enter a batch number' });
      return;
    }

    setLoading(true);
    setResult(null);

    if (!API_KEY) {
      setResult({ error: 'API configuration error. Please contact administrator.' });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?filterByFormula=SEARCH("${query.toLowerCase()}", LOWER({batchnumber}))`,
        {
          headers: { Authorization: `Bearer ${API_KEY}` },
        }
      );

      const records = response.data.records;

      if (records.length > 0) {
        setResult(records[0].fields);
      } else {
        setResult({ error: 'No record found for this Batch Number' });
      }
    } catch (error) {
      console.error('Airtable error:', error.response || error);
      setResult({ error: 'Error fetching data from Airtable. Please try again later.' });
    }

    setLoading(false);
  };

  return (
    <div className="App">
      <img src="/TRU-LogoOptionsFinal_Horizontal.jpg" alt="TruInfusion Logo" className="logo" />
      <h1>TruInfusion Batch Lookup</h1>

      {/* Warning Banner - Always visible at the top */}
      <div className="warning-banner">
        <strong>⚠️ Important Warning:</strong><br />
        Using marijuana during pregnancy could cause birth defects or other health issues to your unborn child.
      </div>

      <div className="search-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter Batch Number (e.g., 0220gr11cbz)"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} disabled={loading || !query.trim()}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {result && (
        <div className="result">
          {/* Warning Banner - Also shown with results */}
          <div className="warning-banner">
            <strong>⚠️ Important Warning:</strong><br />
            Using marijuana during pregnancy could cause birth defects or other health issues to your unborn child.
          </div>

          {result.error ? (
            <p className="error-message">{result.error}</p>
          ) : (
            <>
              <ul className="details">
                <li><strong>Batch Number:</strong> {result['batchnumber']}</li>
                <li>
                  <strong>Public Notes:</strong> {result['publicnotes'] || 'N/A'}
                  <br />
                  <a
                    href="https://drive.google.com/drive/folders/1WB86KIZGmO-gvZyUlI2gmgilUrRbrA8e?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dist-link"
                  >
                    Distribution Chain>>
                  </a>
                </li>
              </ul>

              <div className="pdf-container">
                <div className="pdf-item">
                  {result['PDF1'] && (
                    <>
                      <img
                        src={result['PDF1'][0].thumbnails?.large?.url || result['PDF1'][0].url}
                        alt="Cover Page Preview"
                        className="pdf-preview"
                      />
                      <a href={result['PDF1'][0].url} target="_blank" rel="noopener noreferrer">
                        View Cover Page
                      </a>
                    </>
                  )}
                  {!result['PDF1'] && <p>No Cover Page Available</p>}
                </div>

                <div className="pdf-item">
                  {result['PDF2'] && (
                    <>
                      <img
                        src={result['PDF2'][0].thumbnails?.large?.url || result['PDF2'][0].url}
                        alt="Test Results Preview"
                        className="pdf-preview"
                      />
                      <a href={result['PDF2'][0].url} target="_blank" rel="noopener noreferrer">
                        View Test Results
                      </a>
                    </>
                  )}
                  {!result['PDF2'] && <p>No Test Results Available</p>}
                </div>

                <div className="pdf-item">
                  {result['PDF3'] && (
                    <>
                      <img
                        src={result['PDF3'][0].thumbnails?.large?.url || result['PDF3'][0].url}
                        alt="Additional Results Preview"
                        className="pdf-preview"
                      />
                      <a href={result['PDF3'][0].url} target="_blank" rel="noopener noreferrer">
                        View Additional Results
                      </a>
                    </>
                  )}
                  {!result['PDF3'] && <p>No Additional Results Available</p>}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;