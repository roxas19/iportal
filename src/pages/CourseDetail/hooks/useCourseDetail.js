import { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';

/**
 * useCourseDetail Hook - Course Detail Page State Management
 * 
 * Handles:
 * - Loading course data with units, goals, and materials
 * - CRUD operations for units, goals, and materials
 * - Loading states and error handling
 * - Modal state management for creation forms
 * 
 * Following the same pattern as useCourses and useInstructorDashboard
 */
export const useCourseDetail = (courseId) => {
  // Main data state
  const [course, setCourse] = useState(null);
  const [units, setUnits] = useState([]);
  const [courseGoals, setCourseGoals] = useState([]);
  const [courseMaterials, setCourseMaterials] = useState([]);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateUnitModal, setShowCreateUnitModal] = useState(false);
  const [showCreateGoalModal, setShowCreateGoalModal] = useState(false);
  const [showCreateMaterialModal, setShowCreateMaterialModal] = useState(false);

  // Load course data
  const loadCourseData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load course details and all related data in parallel
      const [courseRes, unitsRes, goalsRes, materialsRes] = await Promise.all([
        api.get(`/api/courses/${courseId}/`),
        api.get(`/api/courses/${courseId}/units/`),
        api.get(`/api/courses/${courseId}/goals/`),
        api.get(`/api/courses/${courseId}/materials/`)
      ]);
      
      // Set course data
      if (courseRes.data.success && courseRes.data.data?.course) {
        setCourse(courseRes.data.data.course);
      } else {
        throw new Error('Failed to load course data');
      }
      
      // Set units data
      if (unitsRes.data.success && unitsRes.data.data?.units) {
        setUnits(unitsRes.data.data.units);
      } else if (Array.isArray(unitsRes.data)) {
        // Fallback for direct array response
        setUnits(unitsRes.data);
      } else {
        setUnits([]);
      }
      
      // Set goals data
      if (goalsRes.data.success && goalsRes.data.data?.goals) {
        setCourseGoals(goalsRes.data.data.goals);
      } else if (Array.isArray(goalsRes.data)) {
        // Fallback for direct array response
        setCourseGoals(goalsRes.data);
      } else {
        setCourseGoals([]);
      }
      
      // Set materials data
      if (materialsRes.data.success && materialsRes.data.data?.materials) {
        setCourseMaterials(materialsRes.data.data.materials);
      } else if (Array.isArray(materialsRes.data)) {
        // Fallback for direct array response
        setCourseMaterials(materialsRes.data);
      } else {
        setCourseMaterials([]);
      }
      
    } catch (err) {
      console.error('Error loading course data:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load course data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  // Initial load on mount
  useEffect(() => {
    if (courseId) {
      loadCourseData();
    }
  }, [courseId, loadCourseData]);

  // Course update handler
  const handleCourseUpdate = useCallback(async (updatedData) => {
    try {
      const response = await api.put(`/api/courses/${courseId}/`, updatedData);
      if (response.data.success) {
        setCourse(response.data.data.course);
        return true;
      }
    } catch (err) {
      console.error('Error updating course:', err);
      throw err;
    }
  }, [courseId]);

  // Units handlers
  const handleCreateUnit = useCallback(async (unitData) => {
    try {
      const response = await api.post(`/api/courses/instructor/courses/${courseId}/units/create/`, unitData);
      if (response.data.success || response.data.id) {
        const newUnit = response.data.success ? response.data.data.unit : response.data;
        setUnits(prev => [...prev, newUnit]);
        setShowCreateUnitModal(false);
        return true;
      }
    } catch (err) {
      console.error('Error creating unit:', err);
      throw err;
    }
  }, [courseId]);

  const handleUpdateUnit = useCallback(async (unitId, unitData) => {
    try {
      const response = await api.put(`/api/courses/instructor/units/${unitId}/update/`, unitData);
      if (response.data.success || response.data.id) {
        const updatedUnit = response.data.success ? response.data.data.unit : response.data;
        setUnits(prev => prev.map(unit => unit.id === unitId ? updatedUnit : unit));
        return true;
      }
    } catch (err) {
      console.error('Error updating unit:', err);
      throw err;
    }
  }, []);

  const handleDeleteUnit = useCallback(async (unitId) => {
    try {
      await api.delete(`/api/courses/instructor/units/${unitId}/delete/`);
      setUnits(prev => prev.filter(unit => unit.id !== unitId));
      return true;
    } catch (err) {
      console.error('Error deleting unit:', err);
      throw err;
    }
  }, []);

  // Goals handlers
  const handleCreateGoal = useCallback(async (goalData) => {
    try {
      const response = await api.post(`/api/courses/instructor/courses/${courseId}/goals/create/`, goalData);
      if (response.data.success || response.data.id) {
        const newGoal = response.data.success ? response.data.data.goal : response.data;
        setCourseGoals(prev => [...prev, newGoal]);
        setShowCreateGoalModal(false);
        return true;
      }
    } catch (err) {
      console.error('Error creating goal:', err);
      throw err;
    }
  }, [courseId]);

  const handleUpdateGoal = useCallback(async (goalId, goalData) => {
    try {
      const response = await api.put(`/api/courses/instructor/goals/${goalId}/update/`, goalData);
      if (response.data.success || response.data.id) {
        const updatedGoal = response.data.success ? response.data.data.goal : response.data;
        setCourseGoals(prev => prev.map(goal => goal.id === goalId ? updatedGoal : goal));
        return true;
      }
    } catch (err) {
      console.error('Error updating goal:', err);
      throw err;
    }
  }, []);

  const handleDeleteGoal = useCallback(async (goalId) => {
    try {
      await api.delete(`/api/courses/instructor/goals/${goalId}/delete/`);
      setCourseGoals(prev => prev.filter(goal => goal.id !== goalId));
      return true;
    } catch (err) {
      console.error('Error deleting goal:', err);
      throw err;
    }
  }, []);

  const handleToggleGoalComplete = useCallback(async (goalId, completed = true) => {
    try {
      const response = await api.post(`/api/courses/goals/${goalId}/complete/`, { completed });
      if (response.data.success) {
        // Update goal completion status in local state if needed
        // This might require refetching completion status
        return true;
      }
    } catch (err) {
      console.error('Error toggling goal completion:', err);
      throw err;
    }
  }, []);

  // Materials handlers
  const handleCreateMaterial = useCallback(async (materialData) => {
    try {
      const response = await api.post(`/api/courses/instructor/courses/${courseId}/materials/create/`, materialData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.data.success || response.data.id) {
        const newMaterial = response.data.success ? response.data.data.material : response.data;
        setCourseMaterials(prev => [...prev, newMaterial]);
        setShowCreateMaterialModal(false);
        return true;
      }
    } catch (err) {
      console.error('Error creating material:', err);
      throw err;
    }
  }, [courseId]);

  const handleUpdateMaterial = useCallback(async (materialId, materialData) => {
    try {
      const response = await api.put(`/api/courses/instructor/materials/${materialId}/update/`, materialData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.data.success || response.data.id) {
        const updatedMaterial = response.data.success ? response.data.data.material : response.data;
        setCourseMaterials(prev => prev.map(material => material.id === materialId ? updatedMaterial : material));
        return true;
      }
    } catch (err) {
      console.error('Error updating material:', err);
      throw err;
    }
  }, []);

  const handleDeleteMaterial = useCallback(async (materialId) => {
    try {
      await api.delete(`/api/courses/instructor/materials/${materialId}/delete/`);
      setCourseMaterials(prev => prev.filter(material => material.id !== materialId));
      return true;
    } catch (err) {
      console.error('Error deleting material:', err);
      throw err;
    }
  }, []);

  return {
    // Data
    course,
    units,
    courseGoals,
    courseMaterials,
    loading,
    error,
    
    // Course actions
    handleCourseUpdate,
    
    // Units actions
    handleCreateUnit,
    handleUpdateUnit,
    handleDeleteUnit,
    
    // Goals actions
    handleCreateGoal,
    handleUpdateGoal,
    handleDeleteGoal,
    handleToggleGoalComplete,
    
    // Materials actions
    handleCreateMaterial,
    handleUpdateMaterial,
    handleDeleteMaterial,
    
    // UI state
    showCreateUnitModal,
    showCreateGoalModal,
    showCreateMaterialModal,
    setShowCreateUnitModal,
    setShowCreateGoalModal,
    setShowCreateMaterialModal,
    
    // Utility
    refetch: loadCourseData
  };
};
