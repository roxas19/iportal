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
import { PrimaryButton, IconButton, SecondaryButton } from '../../../../general/buttons';
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
  // Backend-connected state for material section
  const [materialSection, setMaterialSection] = useState(null);
  const [notesText, setNotesText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [voiceNoteUrl, setVoiceNoteUrl] = useState(null);
  
  // State for material editing
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
        setMaterialSection(response.data.data.material_section);
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
  
  // Update local notes when section loads
  useEffect(() => {
    if (materialSection?.instructor_notes) {
      setNotesText(materialSection.instructor_notes);
    }
    if (materialSection?.voice_note) {
      setVoiceNoteUrl(materialSection.voice_note);
    }
  }, [materialSection]);

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

  const handleCreateMaterial = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  const handleMaterialCreated = async (materialData) => {
    try {
      await onCreateMaterial(materialData);
    } catch (error) {
      console.error('Failed to create material:', error);
      throw error;
    }
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
      try {
        await onDeleteMaterial(materialId);
      } catch (error) {
        console.error('Failed to delete material:', error);
      }
    }
  };

  const handleToggleInstructorNotes = () => {
    // Notes are always visible now - this function can be removed
  };

  const handleSaveNotes = async () => {
    try {
      setLoading(true);
      if (materialSection?.id) {
        const response = await coursesAPI.updateCourseMaterialSection(materialSection.id, {
          instructor_notes: notesText
        });
        
        if (response.data.success) {
          setMaterialSection(response.data.data.material_section);
        }
      }
      setError(null);
    } catch (err) {
      console.error('Error saving notes:', err);
      setError('Failed to save notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-save notes with debounce
  useEffect(() => {
    if (!notesText || notesText === materialSection?.instructor_notes) return;
    
    const timeoutId = setTimeout(() => {
      handleSaveNotes();
    }, 2000); // Auto-save after 2 seconds of no typing
    
    return () => clearTimeout(timeoutId);
  }, [notesText, materialSection?.instructor_notes]);

  // Voice recording functionality
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { 
        mimeType: 'audio/webm;codecs=opus' 
      });
      
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

      // Start recording timer
      const timer = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 120) { // 2 minutes limit
            stopRecording();
            return 120;
          }
          return prev + 1;
        });
      }, 1000);

      recorder.timer = timer;
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
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('voice_note', audioBlob, 'voice_note.webm');
      
      if (materialSection?.id) {
        const response = await coursesAPI.updateCourseMaterialSection(materialSection.id, formData);
        
        if (response.data.success) {
          setMaterialSection(response.data.data.material_section);
          setVoiceNoteUrl(response.data.data.material_section.voice_note);
        }
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
    if (window.confirm('Are you sure you want to delete this voice note?')) {
      try {
        setLoading(true);
        if (materialSection?.id) {
          const formData = new FormData();
          formData.append('voice_note', ''); // Empty to delete
          
          const response = await coursesAPI.updateCourseMaterialSection(materialSection.id, formData);
          
          if (response.data.success) {
            setMaterialSection(response.data.data.material_section);
            setVoiceNoteUrl(null);
          }
        }
        setError(null);
      } catch (err) {
        console.error('Error deleting voice note:', err);
        setError('Failed to delete voice note. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('audio/')) {
        setError('Please upload an audio file');
        return;
      }
      
      await uploadVoiceNote(file);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownloadMaterial = (material) => {
    if (material.file) {
      window.open(material.file, '_blank');
    } else if (material.link) {
      window.open(material.link, '_blank');
    }
  };

  const handleEditModalSubmit = async (materialData) => {
    try {
      await onUpdateMaterial(editingMaterial.id, materialData);
      setShowEditModal(false);
      setEditingMaterial(null);
    } catch (error) {
      console.error('Failed to update material:', error);
    }
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setEditingMaterial(null);
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

      {/* Instructor Notes Section - Always Visible */}
      <div className="instructor-notes-section">
        <div className="notes-header">
          <h4>📝 Instructor Notes</h4>
          <p className="notes-subtitle">
            Add context, instructions, or guidance for students about these materials
          </p>
        </div>
        
        <div className="notes-content">
          {error && (
            <div className="notes-error">
              <span className="error-text">{error}</span>
            </div>
          )}
          
          <textarea
            value={notesText}
            onChange={(e) => setNotesText(e.target.value)}
            placeholder="No instructor notes yet. Add context or instructions for students about these course materials..."
            className="notes-textarea"
            rows="4"
            disabled={loading}
          />
          
          {/* Voice Notes Controls */}
          <div className="voice-notes-controls">
            <div className="voice-actions">
              {!isRecording ? (
                <button
                  className="voice-btn record-btn"
                  onClick={startRecording}
                  disabled={loading}
                  title="Record voice note (2 min max)"
                >
                  🎤 Record ({formatTime(120)})
                </button>
              ) : (
                <button
                  className="voice-btn recording-btn"
                  onClick={stopRecording}
                  title="Stop recording"
                >
                  ⏹️ Stop ({formatTime(recordingTime)})
                </button>
              )}
              
              <label className="voice-btn upload-btn" title="Upload audio file">
                📁 Upload
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  disabled={loading}
                />
              </label>
            </div>
            
            {/* Voice Note Player */}
            {voiceNoteUrl && (
              <div className="voice-player">
                <audio controls src={voiceNoteUrl} className="audio-player">
                  Your browser does not support audio playback.
                </audio>
                <button
                  className="voice-btn delete-btn"
                  onClick={deleteVoiceNote}
                  disabled={loading}
                  title="Delete voice note"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>
        </div>
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
