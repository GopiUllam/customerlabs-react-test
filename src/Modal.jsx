import React, { useState, useMemo } from 'react';

export default function Modal({ onClose, options }) {
 //WebHook url
  const WEBHOOK_URL = 'https://webhook.site/8ad6896b-8387-49bc-a413-9a3115f0337a';

  const [segmentName, setSegmentName] = useState('');
  const [mainSelect, setMainSelect] = useState('');

  const [addedSchemas, setAddedSchemas] = useState([]);

  
  const selectedValues = useMemo(() => new Set(addedSchemas.map(s => s.value)), [addedSchemas]);


  const availableForMain = options.filter(o => !selectedValues.has(o.value));

  function handleAddSchema(e) {
    e.preventDefault();
    if (!mainSelect) return;

    setAddedSchemas(prev => [...prev, { id: Date.now().toString(), value: mainSelect }]);
    setMainSelect(''); 
  }

  function handleChangeAddedSchema(id, newValue) {
    setAddedSchemas(prev => prev.map(s => s.id === id ? { ...s, value: newValue } : s));
  }

  function handleRemoveSchema(id) {
    setAddedSchemas(prev => prev.filter(s => s.id !== id));
  }

  async function handleSave() {
    if (!segmentName) {
      alert('Please enter segment name');
      return;
    }

    // Build schema array in required format: [ { "first_name": "First Name" }, ... ]
    const schema = addedSchemas.map(s => {
      const opt = options.find(o => o.value === s.value);
      return { [s.value]: opt ? opt.label : s.value };
    });

    const payload = {
      segment_name: segmentName,
      schema: schema
    };

    console.log('Payload to send:', payload)

    try {
      const resp = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!resp.ok) throw new Error('Network response not ok');

      alert('Segment saved and sent to webhook');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to send data to webhook');
    }
  }

  
  function availableOptionsFor(id) {
     const otherSelected = new Set(addedSchemas.filter(s => s.id !== id).map(s => s.value));
    return options.filter(o => !otherSelected.has(o.value));
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <header className="modal-header">
          <h2>Save Segment</h2>
          <button className="close" onClick={onClose}>&times;</button>
        </header>

        <div className="modal-body">
          <label className="field">
            <div className="label">Segment name</div>
            <input
              value={segmentName}
              onChange={e => setSegmentName(e.target.value)}
              placeholder="e.g. last_10_days_blog_visits"
            />
          </label>

          <div className="field">
            <div className="label">Add schema to segment</div>
            <select
              value={mainSelect}
              onChange={e => setMainSelect(e.target.value)}
            >
              <option value="">-- Select --</option>
              {availableForMain.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <div className="add-link-wrapper">
              <a href="#" onClick={handleAddSchema}>+ Add new schema</a>
            </div>
          </div>

          <div className="blue-box">
            {addedSchemas.length === 0 && (
              <div className="hint">No schemas added yet</div>
            )}

            {addedSchemas.map(s => (
              <div className="added-row" key={s.id}>
                <select
                  value={s.value}
                  onChange={e => handleChangeAddedSchema(s.id, e.target.value)}
                >
                  <option value="">-- Select --</option>
                  {availableOptionsFor(s.id).map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>

                <button className="remove" onClick={() => handleRemoveSchema(s.id)}>Remove</button>
              </div>
            ))}
          </div>
        </div>

        <footer className="modal-footer">
          <button className="btn secondary" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={handleSave}>Save the segment</button>
        </footer>
      </div>
    </div>
  );
}