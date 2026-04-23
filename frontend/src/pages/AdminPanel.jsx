import { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  Building2,
  MessageSquare,
  Users,
  Star,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

function StatCard({ icon, label, value, color }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>{icon}</div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

function BarChart({ data, color }) {
  const max = Math.max(...Object.values(data), 1);
  return (
    <div className="chart-bar-container">
      {Object.entries(data).map(([key, val]) => (
        <div key={key} className="chart-bar-row">
          <span className="chart-bar-label" title={key}>{key}</span>
          <div className="chart-bar-track">
            <div
              className="chart-bar-fill"
              style={{ width: `${(val / max) * 100}%`, background: color }}
            >
              {val}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TypologyForm({ typology, onSave, onCancel }) {
  const defaults = {
    name: '',
    region: '',
    state: '',
    lat: '',
    lng: '',
    climateType: '',
    constructionStyle: '',
    materials: '',
    description: '',
    foundationType: '',
    roofShape: '',
    floors: 1,
    estimatedCost: '',
    hazardResistance: '',
    suitabilityReason: '',
    wallThickness: '',
    roofMaterial: '',
    foundationDepth: '',
    steelGrade: '',
    concreteGrade: '',
    images: '',
  };

  const [form, setForm] = useState(() => {
    if (!typology) return defaults;
    return {
      ...defaults,
      ...typology,
      materials: typology.materials?.join(', ') || '',
      hazardResistance: typology.hazardResistance?.join(', ') || '',
      images: typology.images?.join('\n') || '',
      wallThickness: typology.specifications?.wallThickness || '',
      roofMaterial: typology.specifications?.roofMaterial || '',
      foundationDepth: typology.specifications?.foundationDepth || '',
      steelGrade: typology.specifications?.steelGrade || '',
      concreteGrade: typology.specifications?.concreteGrade || '',
    };
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        region: form.region,
        state: form.state,
        lat: Number(form.lat),
        lng: Number(form.lng),
        climateType: form.climateType,
        constructionStyle: form.constructionStyle,
        materials: form.materials.split(',').map((m) => m.trim()).filter(Boolean),
        description: form.description,
        foundationType: form.foundationType,
        roofShape: form.roofShape,
        floors: Number(form.floors),
        estimatedCost: form.estimatedCost,
        hazardResistance: form.hazardResistance.split(',').map((h) => h.trim()).filter(Boolean),
        suitabilityReason: form.suitabilityReason,
        specifications: {
          wallThickness: form.wallThickness,
          roofMaterial: form.roofMaterial,
          foundationDepth: form.foundationDepth,
          steelGrade: form.steelGrade,
          concreteGrade: form.concreteGrade,
        },
        images: form.images.split('\n').map((i) => i.trim()).filter(Boolean),
      };

      if (typology?.id) {
        await api.put(`/typologies/${typology.id}`, payload);
      } else {
        await api.post('/typologies', payload);
      }
      onSave();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{typology?.id ? 'Edit Typology' : 'Add New Typology'}</h3>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="grid-2">
              <div className="form-group">
                <label>Name *</label>
                <input className="form-input" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Region *</label>
                <input className="form-input" value={form.region} onChange={(e) => handleChange('region', e.target.value)} required />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>State</label>
                <input className="form-input" value={form.state} onChange={(e) => handleChange('state', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Estimated Cost</label>
                <input className="form-input" value={form.estimatedCost} onChange={(e) => handleChange('estimatedCost', e.target.value)} />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Latitude *</label>
                <input className="form-input" type="number" step="any" value={form.lat} onChange={(e) => handleChange('lat', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Longitude *</label>
                <input className="form-input" type="number" step="any" value={form.lng} onChange={(e) => handleChange('lng', e.target.value)} required />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Climate Type *</label>
                <input className="form-input" value={form.climateType} onChange={(e) => handleChange('climateType', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Construction Style *</label>
                <input className="form-input" value={form.constructionStyle} onChange={(e) => handleChange('constructionStyle', e.target.value)} required />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Foundation Type</label>
                <input className="form-input" value={form.foundationType} onChange={(e) => handleChange('foundationType', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Roof Shape</label>
                <input className="form-input" value={form.roofShape} onChange={(e) => handleChange('roofShape', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Materials (comma-separated) *</label>
              <input className="form-input" value={form.materials} onChange={(e) => handleChange('materials', e.target.value)} placeholder="e.g. Bamboo, Stone, Mud" required />
            </div>
            <div className="form-group">
              <label>Hazard Resistance (comma-separated)</label>
              <input className="form-input" value={form.hazardResistance} onChange={(e) => handleChange('hazardResistance', e.target.value)} placeholder="e.g. Earthquake, Flood, Cyclone" />
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea className="form-input" value={form.description} onChange={(e) => handleChange('description', e.target.value)} rows={3} required />
            </div>
            <div className="form-group">
              <label>Suitability Reason</label>
              <textarea className="form-input" value={form.suitabilityReason} onChange={(e) => handleChange('suitabilityReason', e.target.value)} rows={3} />
            </div>
            <h4 style={{ marginBottom: 12, marginTop: 8 }}>Technical Specifications</h4>
            <div className="grid-2">
              <div className="form-group">
                <label>Wall Thickness</label>
                <input className="form-input" value={form.wallThickness} onChange={(e) => handleChange('wallThickness', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Roof Material</label>
                <input className="form-input" value={form.roofMaterial} onChange={(e) => handleChange('roofMaterial', e.target.value)} />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Foundation Depth</label>
                <input className="form-input" value={form.foundationDepth} onChange={(e) => handleChange('foundationDepth', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Floors</label>
                <input className="form-input" type="number" min={1} value={form.floors} onChange={(e) => handleChange('floors', e.target.value)} />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Steel Grade</label>
                <input className="form-input" value={form.steelGrade} onChange={(e) => handleChange('steelGrade', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Concrete Grade</label>
                <input className="form-input" value={form.concreteGrade} onChange={(e) => handleChange('concreteGrade', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Image URLs (one per line)</label>
              <textarea className="form-input" value={form.images} onChange={(e) => handleChange('images', e.target.value)} rows={3} placeholder="https://example.com/image1.jpg" />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} />
              {saving ? 'Saving...' : typology?.id ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [typologies, setTypologies] = useState([]);
  const [allFeedback, setAllFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTypology, setEditingTypology] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, typRes, fbRes] = await Promise.all([
        api.get('/analytics/stats'),
        api.get('/typologies'),
        api.get('/feedback'),
      ]);
      setStats(statsRes.data);
      setTypologies(typRes.data);
      setAllFeedback(fbRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this typology?')) return;
    try {
      await api.delete(`/typologies/${id}`);
      showToast('Typology deleted');
      fetchData();
    } catch {
      showToast('Failed to delete', 'error');
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm('Delete this feedback?')) return;
    try {
      await api.delete(`/feedback/${id}`);
      showToast('Feedback deleted');
      fetchData();
    } catch {
      showToast('Failed to delete', 'error');
    }
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingTypology(null);
    showToast(editingTypology ? 'Typology updated' : 'Typology created');
    fetchData();
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading"><div className="spinner" /></div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Admin Control Panel</h2>
          <p>Manage housing typologies, view analytics, and moderate feedback</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingTypology(null); setShowForm(true); }}>
          <Plus size={16} />
          Add Typology
        </button>
      </div>

      <div className="stats-grid">
        <StatCard icon={<Building2 size={22} />} label="Total Typologies" value={stats?.totalTypologies || 0} color="blue" />
        <StatCard icon={<MessageSquare size={22} />} label="Total Feedback" value={stats?.totalFeedback || 0} color="green" />
        <StatCard icon={<Users size={22} />} label="Total Users" value={stats?.totalUsers || 0} color="amber" />
        <StatCard icon={<Star size={22} />} label="Avg. Rating" value={stats?.avgRating || 0} color="red" />
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['overview', 'typologies', 'feedback'].map((t) => (
          <button
            key={t}
            className={`btn ${tab === t ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab(t)}
            style={{ textTransform: 'capitalize' }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && stats && (
        <div className="grid-2">
          <div className="card">
            <div className="card-body">
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <BarChart3 size={18} />
                By Climate Type
              </h3>
              <BarChart data={stats.climateCounts} color="#3b82f6" />
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <BarChart3 size={18} />
                By Material
              </h3>
              <BarChart data={stats.materialCounts} color="#10b981" />
            </div>
          </div>
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="card-body">
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Recent Feedback</h3>
              {stats.recentFeedback?.length > 0 ? (
                stats.recentFeedback.map((f) => (
                  <div key={f.id} className="feedback-item">
                    <div className="feedback-header">
                      <span className="feedback-author">{f.userName}</span>
                      <span className="feedback-date">{new Date(f.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 4, margin: '4px 0' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={14} fill={s <= f.rating ? '#f59e0b' : 'none'} color={s <= f.rating ? '#f59e0b' : '#e2e8f0'} />
                      ))}
                    </div>
                    {f.comment && <p className="feedback-comment">{f.comment}</p>}
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>No feedback yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === 'typologies' && (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Region</th>
                  <th>Climate</th>
                  <th>Style</th>
                  <th>Cost</th>
                  <th style={{ width: 120 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {typologies.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 600 }}>{t.name}</td>
                    <td>{t.region}</td>
                    <td><span className="tag tag-blue">{t.climateType}</span></td>
                    <td><span className="tag tag-green">{t.constructionStyle}</span></td>
                    <td>{t.estimatedCost}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => { setEditingTypology(t); setShowForm(true); }}
                        >
                          <Edit size={14} />
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'feedback' && (
        <div className="card">
          {allFeedback.length > 0 ? (
            allFeedback.map((f) => (
              <div key={f.id} className="feedback-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div className="feedback-header">
                    <span className="feedback-author">{f.userName}</span>
                    <span className="feedback-date">{new Date(f.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 4, margin: '4px 0' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} fill={s <= f.rating ? '#f59e0b' : 'none'} color={s <= f.rating ? '#f59e0b' : '#e2e8f0'} />
                    ))}
                  </div>
                  {f.comment && <p className="feedback-comment">{f.comment}</p>}
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                    Typology ID: {f.typologyId}
                  </p>
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteFeedback(f.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <MessageSquare size={48} />
              <h3>No feedback yet</h3>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <TypologyForm
          typology={editingTypology}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingTypology(null); }}
        />
      )}

      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
    </div>
  );
}
