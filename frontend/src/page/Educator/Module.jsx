import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeftLong, FaPlus, FaTrash, FaFolderOpen } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import {
  fetchModules,
  createModule,
  updateModule,
  deleteModule,
  clearError,
} from "../../redux/moduleSlice";
import { serverUrl } from "../../App";

const Module = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { moduleData, loading, error } = useSelector((state) => state.module);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingModule, setEditingModule] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Fetch Modules on component mount
  useEffect(() => {
    dispatch(fetchModules(courseId));
  }, [dispatch, courseId]);

  // Handle error display
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Handle Create Module
  const handleCreateModule = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return toast.error("Module title is required");
    }

    try {
      await dispatch(
        createModule({
          courseId,
          moduleData: { title, description },
        })
      ).unwrap();

      toast.success("Module created successfully");
      setTitle("");
      setDescription("");
      setShowCreateForm(false);
    } catch (error) {
      toast.error(error || "Failed to create module");
    }
  };

  // Handle Update Module
  const handleUpdateModule = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return toast.error("Module title is required");
    }

    try {
      await dispatch(
        updateModule({
          moduleId: editingModule._id,
          moduleData: { title, description },
        })
      ).unwrap();

      toast.success("Module updated successfully");
      setTitle("");
      setDescription("");
      setEditingModule(null);
      setShowCreateForm(false);
    } catch (error) {
      toast.error(error || "Failed to update module");
    }
  };

  // Handle Delete Module
  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm("Are you sure you want to delete this module? This will also delete all lectures within it.")) {
      return;
    }

    try {
      await dispatch(deleteModule(moduleId)).unwrap();
      toast.success("Module deleted successfully");
    } catch (error) {
      toast.error(error || "Failed to delete module");
    }
  };

  // Handle Edit Module
  const handleEditModule = (module) => {
    setEditingModule(module);
    setTitle(module.title);
    setDescription(module.description || "");
    setShowCreateForm(true);
  };

  // Handle Cancel Edit
  const handleCancelEdit = () => {
    setEditingModule(null);
    setTitle("");
    setDescription("");
    setShowCreateForm(false);
  };

  // Handle Open Module
  const handleOpenModule = (moduleId) => {
    navigate(`/create-lecture/${courseId}/${moduleId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <FaArrowLeftLong
              onClick={() => navigate(`/edit-course/${courseId}`)}
              className="text-2xl cursor-pointer text-gray-700 hover:text-black transition-all"
            />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Module Management
            </h1>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition-all"
          >
            <FaPlus />
            {showCreateForm ? "Cancel" : "Add Module"}
          </button>
        </div>

        {/* Create/Edit Module Form */}
        {showCreateForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingModule ? "Edit Module" : "Create New Module"}
            </h2>
            <form onSubmit={editingModule ? handleUpdateModule : handleCreateModule}>
              <div className="space-y-6">
                {/* Module Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Module Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Introduction to React"
                    className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-black transition-all"
                    required
                  />
                </div>

                {/* Module Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Module Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of what this module covers..."
                    rows={4}
                    className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-black transition-all resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-black hover:bg-gray-800 disabled:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <ClipLoader size={20} color="white" />
                        {editingModule ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        {editingModule ? <FaEdit /> : <FaPlus />}
                        {editingModule ? "Update Module" : "Create Module"}
                      </>
                    )}
                  </button>
                  {editingModule && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Modules List */}
        <div className="space-y-4">
          {loading && moduleData.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <ClipLoader size={40} color="black" />
            </div>
          ) : moduleData.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">
                <FaFolderOpen />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Modules Yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start by creating your first module to organize your course content.
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition-all"
              >
                <FaPlus className="inline mr-2" />
                Create First Module
              </button>
            </div>
          ) : (
            moduleData.map((module, index) => (
              <div
                key={module._id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Module Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-black text-white text-sm font-bold px-3 py-1 rounded-full">
                        Module {index + 1}
                      </span>
                      <h3 className="text-xl font-bold text-gray-800">
                        {module.title}
                      </h3>
                    </div>
                    {module.description && (
                      <p className="text-gray-600 text-sm">
                        {module.description}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleOpenModule(module._id)}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all text-sm"
                    >
                      <FaFolderOpen />
                      Open
                    </button>
                    <button
                      onClick={() => handleEditModule(module)}
                      className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-all text-sm"
                    >
                      <FaEdit />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteModule(module._id)}
                      className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg font-medium transition-all text-sm"
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Module;