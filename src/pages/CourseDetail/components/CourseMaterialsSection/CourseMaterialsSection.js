import React, { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PrimaryButton, IconButton } from '../../../../general/buttons';
import MaterialCreateModal from '../MaterialCreateModal/MaterialCreateModal';
import { getResourceTypeIcon, getResourceTypeLabel } from '../../../../general/constants';
import { coursesAPI } from '../../../../services/api';
import './CourseMaterialsSection.css';

/**
 * SortableMaterialItem - Individual draggable material item
 */
const SortableMaterialItem = ({ 
  material, 
  onEdit, 
  onDelete, 
  onDownload 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: material.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`list-item material-item ${isDragging ? 'dragging' : ''}`}
      {...attributes}
    >
      <div className="item-content">
        <div className="item-main">
          <div className="item-title-section">
            <div className="item-icon material-icon">
              {getResourceTypeIcon(material.resource_type)}
            </div>
            <div className="item-title-area">
              <h4 className="item-title">{material.title}</h4>
              {material.description && (
                <p className="item-description">{material.description}</p>
              )}
            </div>
          </div>
          <div className="item-metadata">
            <span className="item-tag material-type">
              {getResourceTypeLabel(material.resource_type)}
            </span>
            {material.file_size_display && (
              <span className="item-metadata-detail material-size">
                📊 {material.file_size_display}
              </span>
            )}
            <span className="item-metadata-detail material-order">
              #{material.order}
            </span>
            <span className="item-metadata-detail material-created">
              📅 {new Date(material.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="item-actions">
          <IconButton
            icon="📥"
            onClick={() => onDownload(material)}
            ariaLabel="Download material"
            variant="secondary"
          />
          <IconButton
            icon="✏️"
            onClick={() => onEdit(material.id)}
            ariaLabel="Edit material"
            variant="secondary"
          />
          <IconButton
            icon="🗑️"
            onClick={() => onDelete(material.id)}
            ariaLabel="Delete material"
            variant="danger"
          />
          <div className="drag-handle" {...listeners}>
            <IconButton
              icon="⋮⋮"
              ariaLabel="Drag to reorder"
              variant="ghost"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * CourseMaterialsSection - Materials container with instructor notes and drag-and-drop reordering
 */
const CourseMaterialsSection = ({ 
  materials, 
  courseId, 
  onCreateMaterial, 
  onUpdateMaterial, 
  onDeleteMaterial,
  showCreateModal,
  setShowCreateModal
}) => {
  // State management
  const [materialSection, setMaterialSection] = useState(null);
  const [notesText, setNotesText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [voiceNoteUrl, setVoiceNoteUrl] = useState(null);
  
  // Material editing state
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Load material section from backend
  const loadMaterialSection = useCallback(async () => {
    try {
      setLoading(true);
      const response = await coursesAPI.getCourseMaterialSection(courseId);
      
      if (response.data.success) {
        const section = response.data.data.material_section;
        setMaterialSection(section);
        setNotesText(section.instructor_notes || '');
        setVoiceNoteUrl(section.voice_note);
      }
    } catch (err) {
      console.error('Error loading material section:', err);
      setError('Failed to load material section');
    } finally {
      setLoading(false);
    }
  }, [courseId]);
  
  // Load material section on mount
  useEffect(() => {
    loadMaterialSection();
  }, [loadMaterialSection]);

  // Handle drag and drop reordering
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = materials.findIndex((item) => item.id === active.id);
      const newIndex = materials.findIndex((item) => item.id === over.id);
      
      // Optimistically update local state
      const newMaterials = arrayMove(materials, oldIndex, newIndex);
      
      try {
        // Create bulk reorder data
        const reorderData = newMaterials.map((material, index) => ({
          id: material.id,
          order: index + 1
        }));

        // Call backend to update order
        await coursesAPI.reorderCourseMaterials(courseId, reorderData);
        
        // The parent will handle the state update through onUpdateMaterial or similar
        
      } catch (error) {
        console.error('Failed to reorder materials:', error);
      }
    }
  };

  // Material handlers
  const handleCreateMaterial = () => setShowCreateModal(true);
  const handleCloseModal = () => setShowCreateModal(false);

  const handleMaterialCreated = async (materialData) => {
    await onCreateMaterial(materialData);
  };

  const handleEditMaterial = (materialId) => {
    const material = materials.find(m => m.id === materialId);
    if (material) {
      setEditingMaterial(material);
      setShowEditModal(true);
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    if (window.confirm('Are you sure you want to delete this material? This action cannot be undone.')) {
      await onDeleteMaterial(materialId);
    }
  };

  const handleDownloadMaterial = (material) => {
    const url = material.file || material.link;
    if (url) window.open(url, '_blank');
  };

  const handleEditModalSubmit = async (materialData) => {
    await onUpdateMaterial(editingMaterial.id, materialData);
    setShowEditModal(false);
    setEditingMaterial(null);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setEditingMaterial(null);
  };

  const handleSaveNotes = async () => {
    if (!materialSection?.id) return;
    
    try {
      setLoading(true);
      const response = await coursesAPI.updateCourseMaterialSection(materialSection.id, {
        instructor_notes: notesText
      });
      
      if (response.data.success) {
        setMaterialSection(response.data.data.material_section);
      }
      setError(null);
    } catch (err) {
      console.error('Error saving notes:', err);
      setError('Failed to save notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  // Voice recording functionality
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      
      const chunks = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        await uploadVoiceNote(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
      recorder.start();

      // Timer with 2-minute limit
      recorder.timer = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 120) {
            stopRecording();
            return 120;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      clearInterval(mediaRecorder.timer);
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const uploadVoiceNote = async (audioBlob) => {
    if (!materialSection?.id) return;
    
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('voice_note', audioBlob, 'voice_note.webm');
      
      const response = await coursesAPI.updateCourseMaterialSection(materialSection.id, formData);
      
      if (response.data.success) {
        setMaterialSection(response.data.data.material_section);
        setVoiceNoteUrl(response.data.data.material_section.voice_note);
      }
      setError(null);
    } catch (err) {
      console.error('Error uploading voice note:', err);
      setError('Failed to save voice note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteVoiceNote = async () => {
    if (!window.confirm('Are you sure you want to delete this voice note?') || !materialSection?.id) return;
    
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('voice_note', '');
      
      const response = await coursesAPI.updateCourseMaterialSection(materialSection.id, formData);
      
      if (response.data.success) {
        setMaterialSection(response.data.data.material_section);
        setVoiceNoteUrl(null);
      }
      setError(null);
    } catch (err) {
      console.error('Error deleting voice note:', err);
      setError('Failed to delete voice note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validation
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }
    
    if (!file.type.startsWith('audio/')) {
      setError('Please upload an audio file');
      return;
    }
    
    await uploadVoiceNote(file);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="course-section materials-section">
      <div className="section-header">
        <h2 className="section-title">
          Course Materials
          {materials.length > 0 && (
            <span className="section-count">({materials.length})</span>
          )}
        </h2>
        <div className="section-header-actions">
          <PrimaryButton size="small" onClick={handleCreateMaterial}>
            + Add Material
          </PrimaryButton>
        </div>
      </div>

      {/* Enhanced Instructor Notes Section */}
      <div className="instructor-notes-compact">
        <div className="notes-header-compact">
          <div className="notes-title-group">
            <h4>📝 Instructor Notes & Voice Context</h4>
            <p className="notes-guidance">Add written instructions or record voice explanations for students</p>
          </div>
        </div>
        
        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}
        
        <div className="notes-input-group">
          <textarea
            value={notesText}
            onChange={(e) => setNotesText(e.target.value)}
            placeholder="Provide context, learning objectives, or special instructions for these materials..."
            className="notes-textarea-compact"
            rows="3"
            disabled={loading}
          />
          <button
            className="save-notes-btn"
            onClick={handleSaveNotes}
            disabled={loading || !materialSection?.id}
            title="Save notes"
          >
            {loading ? 'Saving...' : 'Save Notes'}
          </button>
        </div>
        
        <div className="voice-section">
          <span className="voice-label">Voice annotations:</span>
          <div className="voice-actions-inline">
            <button
              className={`voice-action-btn ${isRecording ? 'recording' : 'record'}`}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={loading}
              title={isRecording ? "Stop recording" : "Record voice explanation (2 min max)"}
            >
              {isRecording ? `⏹️ Stop ${formatTime(recordingTime)}` : '🎤 Record explanation'}
            </button>
            <label className="voice-action-btn upload" title="Upload audio explanation">
              📁 Upload audio
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                disabled={loading}
              />
            </label>
          </div>
        </div>
        
        {/* Voice Note Player - Only shows when exists */}
        {voiceNoteUrl && (
          <div className="voice-player-compact">
            <div className="voice-player-info">
              <span>🎵 Voice explanation:</span>
              <button
                className="delete-voice-btn"
                onClick={deleteVoiceNote}
                disabled={loading}
                title="Remove voice explanation"
              >
                Remove
              </button>
            </div>
            <audio controls src={voiceNoteUrl} className="audio-compact">
              Your browser does not support audio playback.
            </audio>
          </div>
        )}
      </div>

      {/* Materials List */}

      {materials.length === 0 ? (
        <div className="section-empty">
          <div className="section-empty-icon">📎</div>
          <h4>No materials yet</h4>
          <p>
            Add course materials like PDFs, videos, documents, and links. 
            These resources will be available to all students in your course.
          </p>
          <PrimaryButton onClick={handleCreateMaterial}>
            Add Your First Material
          </PrimaryButton>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={materials.map(m => m.id)} strategy={verticalListSortingStrategy}>
            <div className="section-list">
              {materials.map((material) => (
                <SortableMaterialItem
                  key={material.id}
                  material={material}
                  onEdit={handleEditMaterial}
                  onDelete={handleDeleteMaterial}
                  onDownload={handleDownloadMaterial}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Material Creation Modal */}
      <MaterialCreateModal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        onMaterialCreated={handleMaterialCreated}
        courseId={courseId}
      />

      {/* Material Edit Modal */}
      <MaterialCreateModal
        isOpen={showEditModal}
        onClose={handleEditModalClose}
        onMaterialCreated={handleEditModalSubmit}
        courseId={courseId}
        initialData={editingMaterial}
        isEditing={true}
      />
    </div>
  );
};

export default CourseMaterialsSection;
