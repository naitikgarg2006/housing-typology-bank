import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  MapPin,
  Shield,
  Ruler,
  Home,
  Layers,
  DollarSign,
  Star,
  Send,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

function StarRating({ value, onChange, readonly = false }) {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={readonly ? 16 : 24}
          className={`star ${star <= value ? 'filled' : 'empty'}`}
          fill={star <= value ? '#f59e0b' : 'none'}
          onClick={() => !readonly && onChange?.(star)}
          style={{ cursor: readonly ? 'default' : 'pointer' }}
        />
      ))}
    </div>
  );
}

export default function TypologyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [typology, setTypology] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/typologies/${id}`),
      api.get(`/feedback/${id}`),
    ])
      .then(([typRes, fbRes]) => {
        setTypology(typRes.data);
        setFeedback(fbRes.data);
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!rating) return;
    setSubmitting(true);
    try {
      const res = await api.post('/feedback', { typologyId: id, rating, comment });
      setFeedback((prev) => [res.data, ...prev]);
      setRating(0);
      setComment('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading"><div className="spinner" /></div>
      </div>
    );
  }

  if (!typology) return null;

  const specs = [
    { icon: <Layers size={18} />, label: 'Foundation', value: typology.foundationType },
    { icon: <Home size={18} />, label: 'Roof Shape', value: typology.roofShape },
    { icon: <Ruler size={18} />, label: 'Wall Thickness', value: typology.specifications?.wallThickness },
    { icon: <Layers size={18} />, label: 'Roof Material', value: typology.specifications?.roofMaterial },
    { icon: <Ruler size={18} />, label: 'Foundation Depth', value: typology.specifications?.foundationDepth },
    { icon: <DollarSign size={18} />, label: 'Estimated Cost', value: typology.estimatedCost },
  ];

  return (
    <div className="page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="detail-hero">
        <img
          src={typology.images?.[activeImage] || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'}
          alt={typology.name}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800';
          }}
        />
        <div className="detail-hero-overlay">
          <h1>{typology.name}</h1>
          <div className="region" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={18} />
            {typology.region}
          </div>
        </div>
      </div>

      {typology.images?.length > 1 && (
        <div className="image-gallery">
          {typology.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`View ${i + 1}`}
              className={i === activeImage ? 'active' : ''}
              onClick={() => setActiveImage(i)}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800';
              }}
            />
          ))}
        </div>
      )}

      <div className="detail-grid" style={{ marginTop: 32 }}>
        <div>
          <div className="card">
            <div className="card-body">
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>About This Design</h3>
              <p style={{ color: 'var(--text-light)', lineHeight: 1.8 }}>{typology.description}</p>

              <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <span className="tag tag-blue">{typology.climateType}</span>
                <span className="tag tag-green">{typology.constructionStyle}</span>
                <span className="tag tag-purple">{typology.floors} Floor{typology.floors > 1 ? 's' : ''}</span>
              </div>

              <h4 style={{ marginTop: 24, marginBottom: 12, fontSize: 15, fontWeight: 700 }}>
                Building Materials
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {typology.materials?.map((m) => (
                  <span key={m} className="tag tag-amber">{m}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="suitability-box">
            <h3>
              <CheckCircle size={20} />
              Why This Design Works Here
            </h3>
            <p>{typology.suitabilityReason}</p>
            <div className="hazard-badges">
              {typology.hazardResistance?.map((h) => (
                <span key={h} className="hazard-badge">
                  <AlertTriangle size={14} />
                  {h} Resistant
                </span>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginTop: 24 }}>
            <div className="card-body">
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Send size={18} />
                Leave Feedback
              </h3>

              {submitted && (
                <div style={{
                  background: '#d1fae5',
                  color: '#065f46',
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: 16,
                  fontSize: 14,
                }}>
                  Thank you for your feedback!
                </div>
              )}

              <form onSubmit={handleSubmitFeedback}>
                <div className="form-group">
                  <label>Your Rating</label>
                  <StarRating value={rating} onChange={setRating} />
                </div>
                <div className="form-group">
                  <label>Comments / Suggestions</label>
                  <textarea
                    className="form-input"
                    placeholder="Share your thoughts on this housing design..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={!rating || submitting}>
                  <Send size={16} />
                  {submitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            </div>
          </div>

          {feedback.length > 0 && (
            <div className="card" style={{ marginTop: 24 }}>
              <div style={{ padding: '20px 20px 8px' }}>
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>
                  User Feedback ({feedback.length})
                </h3>
              </div>
              {feedback.map((f) => (
                <div key={f.id} className="feedback-item">
                  <div className="feedback-header">
                    <div>
                      <span className="feedback-author">{f.userName}</span>
                      <StarRating value={f.rating} readonly />
                    </div>
                    <span className="feedback-date">
                      {new Date(f.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {f.comment && <p className="feedback-comment">{f.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="card" style={{ position: 'sticky', top: 24 }}>
            <div className="card-body">
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Shield size={18} />
                Technical Specifications
              </h3>
              <div className="spec-grid" style={{ gridTemplateColumns: '1fr' }}>
                {specs.map((spec) => (
                  spec.value && (
                    <div key={spec.label} className="spec-item">
                      <div className="label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {spec.icon}
                        {spec.label}
                      </div>
                      <div className="value">{spec.value}</div>
                    </div>
                  )
                ))}
              </div>

              {typology.specifications?.steelGrade && typology.specifications.steelGrade !== 'N/A' && (
                <div className="spec-item" style={{ marginTop: 16 }}>
                  <div className="label">Steel Grade</div>
                  <div className="value">{typology.specifications.steelGrade}</div>
                </div>
              )}
              {typology.specifications?.concreteGrade && typology.specifications.concreteGrade !== 'N/A' && (
                <div className="spec-item" style={{ marginTop: 8 }}>
                  <div className="label">Concrete Grade</div>
                  <div className="value">{typology.specifications.concreteGrade}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
