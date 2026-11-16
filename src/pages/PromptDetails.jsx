
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import {
  ArrowLeft,
  Copy,
  Check,
  FileText,
  AlertCircle,
  Sparkles,
  LayoutDashboard,
  ArrowRight,
  Hash,
  Image,
  AlignLeft
} from 'lucide-react';

import {
  getImageById,
  generateImage
} from '../services/imageApi';
import { uploadToDrive } from '../services/driveService';

import './PromptDetails.css';

function PromptDetails() {
  const { imageId } = useParams();
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState('');
  const [generationError, setGenerationError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await getImageById(imageId);

        const record =
          response?.image ??
          response?.data ??
          response;

        console.log('Fetched Image Record:', record);

        setImage(record);

      } catch (err) {
        console.error('Failed to load prompt:', err);

        setError(
          err.message || 'Unable to load prompt details.'
        );

      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [imageId]);

  const copyPrompt = async () => {
    if (!image?.prompt) return;

    try {
      await navigator.clipboard.writeText(image.prompt);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch {
      setGenerationError('Unable to copy prompt.');
    }
  };

  // Generate Single Image
  const handleGenerateImage = async () => {
    if (
      image?.image_id === undefined ||
      image?.image_id === null ||
      image?.image_id === '' ||
      generating
    ) {
      console.error('Invalid Image ID:', image?.image_id);
      return;
    }

    try {
      setGenerating(true);
      setGenerationError('');
      setGeneratedImage('');

      console.log('Selected Image ID:', image.image_id);
      console.log('Selected Image Record:', image);

      const response = await generateImage(image.image_id);

      console.log('Single Generate API Response:', response);

      if (
        response?.status &&
        response.status.toLowerCase() !== 'success'
      ) {
        throw new Error(
          response.error || 'Image generation was unsuccessful.'
        );
      }

      if (!response?.image_data) {
        throw new Error('Generated image data is missing.');
      }

      // 1. Set the generated image to the UI state (Existing logic)
      setGeneratedImage(response.image_data);

      // 2. TRIGGER PHASE 4: Fetch the generated image, convert to Blob, and upload to Google Drive
      try {
        const imageFetchRes = await fetch(response.image_data);
        const imageBlob = await imageFetchRes.blob();
        await uploadToDrive(imageBlob, image.image_id);
      } catch (driveErr) {
        console.error("Drive upload helper error:", driveErr);
      }

    } catch (err) {
      console.error('Failed to generate image:', err);

      setGenerationError(
        err.message || 'Unable to generate image. Please try again.'
      );

    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="details-message">
        <div className="details-spinner" />
        <p>Loading prompt details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="details-message details-error">
        <AlertCircle size={30} />
        <p>{error}</p>

        <button onClick={() => navigate('/')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!image) {
    return (
      <div className="details-message">
        <FileText size={30} />
        <p>Record not found.</p>

        <button onClick={() => navigate('/')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="prompt-details-page">

      <Link to="/gallery" className="details-back-link">
        <ArrowLeft size={17} />
        Back to Gallery
      </Link>

      <section className="details-header">
        <div>
          <div className="details-eyebrow">
            <Sparkles size={15} />
            BRAYNEX AI WORKSPACE
          </div>

          <h1>
            Prompt <span>Details</span>
          </h1>

          <p>
            View complete information about this image prompt record.
          </p>
        </div>

        <span className="details-record-badge">
          RECORD #{image.image_id}
        </span>
      </section>

      <section className="details-info-card">

        <div className="details-card-heading">
          <div className="details-heading-icon">
            <FileText size={22} />
          </div>

          <div>
            <h2>Record Information</h2>
            <p>Complete database record details</p>
          </div>
        </div>

        <div className="details-field-grid">

          <div className="details-field">
            <div className="details-field-label">
              <Hash size={15} />
              Image ID
            </div>

            <h3>
              {image.image_id ?? 'Not available'}
            </h3>
          </div>

          <div className="details-field">
            <div className="details-field-label">
              <Image size={15} />
              Image Name
            </div>

            <h3>
              {image.image_name || image.name || 'Untitled'}
            </h3>
          </div>

        </div>

        <div className="details-description">
          <div className="details-field-label">
            <AlignLeft size={15} />
            Description
          </div>

          <p>
            {image.description || 'No description available.'}
          </p>
        </div>

        <div className="details-prompt-section">

          <div className="details-prompt-heading">
            <div>
              <div className="details-field-label">
                <FileText size={15} />
                Complete Image Prompt
              </div>

              <p>Full prompt content</p>
            </div>

            <button
              className={`details-copy-button ${copied ? 'copied' : ''}`}
              onClick={copyPrompt}
              disabled={!image.prompt}
            >
              {copied ? (
                <Check size={16} />
              ) : (
                <Copy size={16} />
              )}

              {copied ? 'Copied' : 'Copy Prompt'}
            </button>
          </div>

          <div className="details-prompt-content">
            {image.prompt || 'No prompt available.'}
          </div>

        </div>

        <button
          className="details-generate-button"
          type="button"
          onClick={handleGenerateImage}
          disabled={generating}
        >
          {generating ? (
            <>
              <Sparkles size={18} className="details-generating-spin" />
              Generating Image...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              {generatedImage ? 'Generate Again' : 'Generate Image'}
            </>
          )}
        </button>

        {generationError && (
          <div className="details-generation-error">
            <AlertCircle size={18} />
            <span>{generationError}</span>
          </div>
        )}

        {/* AI Generation Animation */}
        {generating && (
          <div className="details-generation-loading">

            <div className="ai-loading-animation">

              <div className="ai-orbit orbit-one"></div>
              <div className="ai-orbit orbit-two"></div>

              <div className="ai-core">
                <Sparkles size={26} />
              </div>

            </div>

            <h3>Creating Your Image</h3>

            <p>
              AI is processing your prompt. Please wait...
            </p>

            <div className="ai-progress-track">
              <div className="ai-progress-bar"></div>
            </div>

            <div className="ai-loading-note">
              <span className="loading-dot"></span>
              AI Image Generation in Progress
            </div>

          </div>
        )}

        {generatedImage && !generating && (
          <div className="details-generated-section">

            <div className="details-generated-heading">
              <Sparkles size={19} />

              <div>
                <h2>Generated Image</h2>
                <p>Your AI-generated image is ready.</p>
              </div>
            </div>

            <img
              src={generatedImage}
              alt={image.image_name || 'AI Generated Image'}
              className="details-generated-image"
            />

            <button
              className="details-download-button"
              onClick={() => {
                const link = document.createElement('a');

                link.href = generatedImage;
                link.download = `braynex-image-${image.image_id}.jpg`;

                link.click();
              }}
            >
              Download Image
            </button>

          </div>
        )}

      </section>

      <section
        className="details-dashboard-card"
        onClick={() => navigate('/')}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            navigate('/');
          }
        }}
      >
        <div className="details-dashboard-icon">
          <LayoutDashboard size={25} />
        </div>

        <div className="details-dashboard-content">
          <span>EXPLORE MORE</span>

          <h2>Back to Dashboard</h2>

          <p>
            Return to all existing image records and explore more details.
          </p>
        </div>

        <ArrowRight
          size={23}
          className="details-dashboard-arrow"
        />

      </section>

    </div>
  );
}

export default PromptDetails;
