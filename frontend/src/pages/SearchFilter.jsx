import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Search, MapPin, Filter, X, Building2 } from 'lucide-react';

export default function SearchFilter() {
  const [typologies, setTypologies] = useState([]);
  const [filters, setFilters] = useState({ materials: [], climates: [], styles: [], regions: [] });
  const [search, setSearch] = useState('');
  const [material, setMaterial] = useState('');
  const [climate, setClimate] = useState('');
  const [style, setStyle] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/typologies/filters').then((res) => setFilters(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (material) params.set('material', material);
    if (climate) params.set('climate', climate);
    if (style) params.set('style', style);

    api
      .get(`/typologies?${params}`)
      .then((res) => setTypologies(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, material, climate, style]);

  const clearFilters = () => {
    setSearch('');
    setMaterial('');
    setClimate('');
    setStyle('');
  };

  const hasActiveFilters = search || material || climate || style;

  return (
    <div className="page">
      <div className="page-header">
        <h2>Search & Filter Typologies</h2>
        <p>Find the perfect housing design by material, climate, or construction style</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center' }}>
        <div className="search-input-wrapper" style={{ flex: 1 }}>
          <Search size={18} />
          <input
            type="text"
            className="form-input"
            placeholder="Search by name, region, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} />
          Filters
        </button>
        {hasActiveFilters && (
          <button className="btn btn-secondary" onClick={clearFilters}>
            <X size={16} />
            Clear
          </button>
        )}
      </div>

      {showFilters && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 12,
            marginBottom: 24,
            padding: 20,
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
          }}
        >
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Material</label>
            <select className="form-input" value={material} onChange={(e) => setMaterial(e.target.value)}>
              <option value="">All Materials</option>
              {filters.materials.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Climate Type</label>
            <select className="form-input" value={climate} onChange={(e) => setClimate(e.target.value)}>
              <option value="">All Climates</option>
              {filters.climates.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Construction Style</label>
            <select className="form-input" value={style} onChange={(e) => setStyle(e.target.value)}>
              <option value="">All Styles</option>
              {filters.styles.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div style={{ marginBottom: 16, fontSize: 14, color: 'var(--text-light)' }}>
        Showing {typologies.length} typolog{typologies.length === 1 ? 'y' : 'ies'}
        {hasActiveFilters && ' (filtered)'}
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : typologies.length === 0 ? (
        <div className="empty-state">
          <Building2 size={48} />
          <h3>No typologies found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid-3">
          {typologies.map((t) => (
            <div key={t.id} className="typology-card" onClick={() => navigate(`/typology/${t.id}`)}>
              <img
                src={t.images?.[0] || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'}
                alt={t.name}
                className="typology-card-image"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800';
                }}
              />
              <div className="typology-card-body">
                <h3>{t.name}</h3>
                <div className="region">
                  <MapPin size={14} />
                  {t.region}
                </div>
                <div className="typology-card-tags">
                  <span className="tag tag-blue">{t.climateType}</span>
                  <span className="tag tag-green">{t.constructionStyle}</span>
                  {t.materials?.slice(0, 2).map((m) => (
                    <span key={m} className="tag tag-amber">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
