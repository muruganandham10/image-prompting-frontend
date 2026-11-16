
import { Link } from 'react-router-dom';
import {
  Image as ImageIcon,
  ArrowUpRight,
  FileText,
  Sparkles
} from 'lucide-react';

import './ImageCard.css';

function ImageCard({ image }) {
  const imageId = image?.image_id ?? image?.id;
  const imageName =
    image?.image_name ||
    image?.name ||
    'Untitled Image';

  const description =
    image?.description ||
    'No description available for this record.';

  const prompt =
    image?.prompt ||
    'No prompt information available.';

  const imageUrl =
    image?.image_url ||
    image?.imageUrl ||
    image?.url ||
    '';

  const hasImage = Boolean(imageUrl);

  return (
    <article className="image-card">
      <div className="image-card-preview">
        {hasImage ? (
          <img
            src={imageUrl}
            alt={imageName}
            className="image-card-img"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
              event.currentTarget.nextElementSibling.style.display = 'flex';
            }}
          />
        ) : null}

        <div
          className="image-card-placeholder"
          style={{ display: hasImage ? 'none' : 'flex' }}
        >
          <div className="placeholder-glow">
            <ImageIcon size={35} strokeWidth={1.4} />
          </div>
          <span>Image Preview</span>
          <small>Preview unavailable</small>
        </div>

        <div className="image-card-overlay">
          <span className="preview-badge">
            <Sparkles size={12} />
            AI PROMPT
          </span>

          <Link
            to={`/prompts/${imageId}`}
            className="preview-action"
            aria-label={`View ${imageName}`}
          >
            <ArrowUpRight size={19} />
          </Link>
        </div>
      </div>

      <div className="image-card-body">
        <div className="image-card-heading">
          <h3 title={imageName}>{imageName}</h3>

          <span className="image-id">
            #{imageId ?? 'N/A'}
          </span>
        </div>

        <p className="image-card-description">
          {description}
        </p>

        <div className="prompt-preview">
          <div className="prompt-preview-heading">
            <FileText size={14} />
            <span>PROMPT PREVIEW</span>
          </div>

          <p>{prompt}</p>
        </div>

        <Link
          to={`/prompts/${imageId}`}
          className="image-card-button"
        >
          View Details
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
}

export default ImageCard;
