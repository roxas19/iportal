import React from 'react';
import { PrimaryButton, IconButton } from '../../../../general/buttons';
import UnitCreateModal from '../UnitCreateModal/UnitCreateModal';
import './UnitsSection.css';

/**
 * UnitsSection Component - Course units management
 * 
 * Features:
 * - Display ordered list of course units
 * - Create new units with modal form
 * - Edit and delete existing units
 * - Beautiful empty state when no units exist
 * - Expand units to show tasks and resources (future)
 * 
 * Following our design system and responsive patterns
 */
const UnitsSection = ({ 
  units, 
  courseId, 
  onCreateUnit, 
  onUpdateUnit, 
  onDeleteUnit,
  showCreateModal,
  setShowCreateModal
}) => {

  const handleCreateUnit = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  const handleUnitCreated = async (unitData) => {
    try {
      await onCreateUnit(unitData);
    } catch (error) {
      console.error('Failed to create unit:', error);
      throw error;
    }
  };

  const handleEditUnit = (unitId) => {
    // TODO: Implement unit editing
    console.log('Edit unit:', unitId);
  };

  const handleDeleteUnit = async (unitId) => {
    if (window.confirm('Are you sure you want to delete this unit? This action cannot be undone.')) {
      try {
        await onDeleteUnit(unitId);
      } catch (error) {
        console.error('Failed to delete unit:', error);
        // TODO: Show error toast
      }
    }
  };

  const handleViewUnit = (unitId) => {
    // TODO: Navigate to unit detail or expand inline
    console.log('View unit:', unitId);
  };

  return (
    <div className="course-section units-section">
      <div className="section-header">
        <h2 className="section-title">
          Units
          {units.length > 0 && (
            <span className="section-count">({units.length})</span>
          )}
        </h2>
        <PrimaryButton size="small" onClick={handleCreateUnit}>
          + Add Unit
        </PrimaryButton>
      </div>

      {units.length === 0 ? (
        <div className="section-empty">
          <div className="section-empty-icon">📚</div>
          <h4>No units yet</h4>
          <p>
            Units are the main learning sections of your course. Each unit can contain 
            tasks, resources, and a main video session.
          </p>
          <PrimaryButton onClick={handleCreateUnit}>
            Create Your First Unit
          </PrimaryButton>
        </div>
      ) : (
        <div className="section-list">
          {units.map((unit, index) => (
            <div key={unit.id} className="section-item unit-item">
              <div className="item-header">
                <div className="item-title-section">
                  <h3 className="item-title">
                    <span className="unit-order">Unit {unit.order || index + 1}:</span>
                    {unit.title}
                  </h3>
                  {unit.description && (
                    <p className="item-description">{unit.description}</p>
                  )}
                </div>
                <div className="item-actions">
                  <IconButton 
                    variant="secondary" 
                    size="small"
                    onClick={() => handleViewUnit(unit.id)}
                  >
                    👁️
                  </IconButton>
                  <IconButton 
                    variant="secondary" 
                    size="small"
                    onClick={() => handleEditUnit(unit.id)}
                  >
                    ✏️
                  </IconButton>
                  <IconButton 
                    variant="secondary" 
                    size="small"
                    onClick={() => handleDeleteUnit(unit.id)}
                  >
                    🗑️
                  </IconButton>
                </div>
              </div>
              
              <div className="item-meta">
                <span className="unit-tasks">
                  📝 {unit.tasks?.length || 0} tasks
                </span>
                <span className="unit-resources">
                  📎 {unit.resources?.length || 0} resources
                </span>
                {unit.main_session_url && (
                  <span className="unit-session">
                    🎥 Main session
                  </span>
                )}
                <span className="unit-created">
                  Created {new Date(unit.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Unit Creation Modal */}
      <UnitCreateModal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        onUnitCreated={handleUnitCreated}
        courseId={courseId}
      />
    </div>
  );
};

export default UnitsSection;
