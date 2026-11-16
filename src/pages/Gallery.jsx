
import { useMemo, useState } from 'react';
import {
  Sparkles,
  Download,
  RefreshCw,
  Image as ImageIcon,
  AlertCircle,
  Search,
  X
} from 'lucide-react';

import { generateAllImages } from '../services/imageApi';
import {
  saveCreation,
  getAllCreations
} from '../services/creationStorage';

import './Gallery.css';

function Gallery() {
  const [creations, setCreations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Search by Image ID or Image Name
  const filteredCreations = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return creations;

    return creations.filter((creation) => {
      const imageId = String(creation.imageId ?? '').toLowerCase();
      const imageName = String(creation.imageName ?? '').toLowerCase();

      return (
        imageId.includes(search) ||
        imageName.includes(search)
      );
    });
  }, [creations, searchTerm]);

  // Generate All Images
  const handleGenerateAll = async () => {
    try {
      setLoading(true);
      setPageLoading(false);
      setError('');
      setMessage('');
      setSearchTerm('');
      setCreations([]);

      const response = await generateAllImages();
      const results = response.results || [];

      let savedCount = 0;

      for (const item of results) {
        if (
          item.image_data &&
          item.status?.toLowerCase() === 'success'
        ) {
          await saveCreation({
            imageId: item.image_id,
            imageName: item.image_name,
            prompt: item.prompt,
            imageData: item.image_data
          });

          savedCount++;
        }
      }

      // Load images only after Generate button is clicked
      const data = await getAllCreations();
      setCreations(data);

      setMessage(
        `${savedCount} images generated and saved successfully!`
      );
    } catch (err) {
      setError(err.message || 'Image generation failed.');
    } finally {
      setLoading(false);
    }
  };

  // Download Image
  const handleDownload = (creation) => {
    const link = document.createElement('a');

    link.href = creation.imageData;
    link.download = `${creation.imageName || 'AI-Image'}.png`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="gallery-page">

      {/* Header */}
      <div className="gallery-header">
        <div>
          <h1>AI Gallery</h1>
          <p>
            Generate, search and explore your AI-created images.
          </p>
        </div>

        <button
          className="generate-all-btn"
          onClick={handleGenerateAll}
          disabled={loading}
        >
          {loading ? (
            <>
              <RefreshCw size={18} className="spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Generate All Images
            </>
          )}
        </button>
      </div>

      {/* Stats */}
      <div className="gallery-stats">
        <div className="gallery-stat-card">
          <ImageIcon size={22} />
          <div>
            <h2>{creations.length}</h2>
            <p>Generated Images</p>
          </div>
        </div>
      </div>

      {/* AI Loading Animation */}
      {loading && (
        <div className="ai-loading-card">
          <div className="ai-loading-animation">
            <div className="ai-orbit orbit-one"></div>
            <div className="ai-orbit orbit-two"></div>

            <div className="ai-core">
              <Sparkles size={30} />
            </div>
          </div>

          <h2>AI is Creating Your Images</h2>

          <p>
            Processing prompts and generating images.
            Please wait...
          </p>

          <div className="ai-progress-track">
            <div className="ai-progress-bar"></div>
          </div>

          <span className="ai-loading-note">
            <span className="loading-dot"></span>
            AI Generation in Progress
          </span>
        </div>
      )}

      {/* Messages */}
      {message && (
        <div className="gallery-message">
          {message}
        </div>
      )}

      {error && (
        <div className="gallery-error">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Search */}
      {creations.length > 0 && !loading && (
        <div className="gallery-search-section">
          <div className="gallery-search-box">
            <Search size={19} />

            <input
              type="text"
              placeholder="Search by Image ID or Image Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {searchTerm && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchTerm('')}
                title="Clear Search"
              >
                <X size={17} />
              </button>
            )}
          </div>

          <p className="search-result-count">
            Showing {filteredCreations.length} of {creations.length} images
          </p>
        </div>
      )}

      {/* Gallery Content */}
      {loading ? null : creations.length === 0 ? (
        <div className="gallery-empty">
          <ImageIcon size={50} />

          <h2>No Images Yet</h2>

          <p>
            Click Generate All Images to create images from your prompts.
          </p>
        </div>
      ) : filteredCreations.length === 0 ? (
        <div className="gallery-empty">
          <Search size={42} />

          <h2>No Matching Images</h2>

          <p>
            No images found for "{searchTerm}".
            Try another ID or image name.
          </p>

          <button
            className="clear-search-action"
            onClick={() => setSearchTerm('')}
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="gallery-grid">
          {filteredCreations.map((creation) => (
            <div
              className="creation-card"
              key={creation.id}
            >
              <div className="creation-image-wrapper">
                <img
                  src={creation.imageData}
                  alt={creation.imageName || 'Generated image'}
                />

                <span className="image-id-badge">
                  ID: {creation.imageId}
                </span>
              </div>

              <div className="creation-info">
                <h3>
                  {creation.imageName || `Image ${creation.imageId}`}
                </h3>

                <p>
                  {creation.prompt || 'AI Generated Image'}
                </p>

                <button
                  className="download-image-btn"
                  onClick={() => handleDownload(creation)}
                >
                  <Download size={16} />
                  Download Image
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Gallery;
