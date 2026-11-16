import { useEffect, useMemo, useState } from 'react';
import {
  Images,
  FileText,
  AlignLeft,
  RefreshCw,
  AlertCircle,
  ArrowUpRight,
  Search,
  Sparkles
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { getImages } from '../services/imageApi';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await getImages();

      const records = Array.isArray(response)
        ? response
        : response?.data || response?.images || [];

      setImages(records);
    } catch (err) {
      setError(err.message || 'Unable to load records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const filteredImages = useMemo(() => {
    return images.filter((item) => {
      const name = item.image_name || item.name || '';
      const description = item.description || '';

      return `${name} ${description}`
        .toLowerCase()
        .includes(search.toLowerCase());
    });
  }, [images, search]);

  const totalPrompts = images.filter((item) => item.prompt).length;

  const totalDescriptions = images.filter(
    (item) => item.description
  ).length;

  return (
    <div className="dashboard-page">

      <section className="dashboard-header">
        <div>
          <div className="dashboard-eyebrow">
            <Sparkles size={15} />
            BRAYNEX AI WORKSPACE
          </div>

          <h1>
            Dashboard <span>Overview</span>
          </h1>

          <p>
            Explore and manage your existing image prompt records.
          </p>
        </div>

        <button
          className="dashboard-refresh"
          onClick={fetchImages}
          disabled={loading}
        >
          <RefreshCw size={17} className={loading ? 'spin' : ''} />
          Refresh
        </button>
      </section>

      <section className="dashboard-stats">

        <div className="dashboard-stat-card">
          <div className="stat-icon purple">
            <Images size={22} />
          </div>

          <div>
            <span>Total Records</span>
            <h2>{images.length}</h2>
            <small>Available database records</small>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon blue">
            <FileText size={22} />
          </div>

          <div>
            <span>Available Prompts</span>
            <h2>{totalPrompts}</h2>
            <small>Records with prompts</small>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon green">
            <AlignLeft size={22} />
          </div>

          <div>
            <span>Descriptions</span>
            <h2>{totalDescriptions}</h2>
            <small>Records with descriptions</small>
          </div>
        </div>

      </section>

      <section className="dashboard-records-section">

        <div className="dashboard-section-header">
          <div>
            <h2>Database Records</h2>
            <p>All existing records from your backend.</p>
          </div>

          <div className="dashboard-search">
            <Search size={17} />

            <input
              type="text"
              placeholder="Search records..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="dashboard-message">
            <RefreshCw size={25} className="spin" />
            <p>Loading records...</p>
          </div>
        ) : error ? (
          <div className="dashboard-message error">
            <AlertCircle size={25} />
            <p>{error}</p>

            <button onClick={fetchImages}>
              Try Again
            </button>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="dashboard-message">
            <Images size={30} />
            <p>No records found.</p>
          </div>
        ) : (
          <div className="dashboard-record-list">

            {filteredImages.map((item, index) => (
              <article
                className="dashboard-record"
                key={item.image_id || index}
              >
                <div className="record-number">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div className="record-content">
                  <h3>
                    {item.image_name || item.name || 'Untitled Record'}
                  </h3>

                  <p>
                    {item.description || 'No description available.'}
                  </p>
                </div>

                <button
                  className="record-view-button"
                  onClick={() =>
                    navigate(`/prompts/${item.image_id}`)
                  }
                  disabled={!item.image_id}
                >
                  View Details
                  <ArrowUpRight size={16} />
                </button>
              </article>
            ))}

          </div>
        )}

        {!loading && !error && (
          <div className="dashboard-footer">
            Showing {filteredImages.length} of {images.length} records
          </div>
        )}

      </section>

    </div>
  );
}

export default Dashboard;