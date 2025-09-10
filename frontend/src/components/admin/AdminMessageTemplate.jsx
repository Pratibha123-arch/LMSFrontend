// src/pages/teacher/TeacherMessages.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

const AdminMessageTemplate = () => {
  const { token } = useContext(AppContext);

  const [templates, setTemplates] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    language: "",
    isActive: "",
    page: 1,
    limit: 10,
  });

  const [newTemplate, setNewTemplate] = useState({
    name: "",
    type: "reminder",
    subject: "",
    content: "",
    language: "en",
    category: "email",
    variables: [],
  });

  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [previewTemplateId, setPreviewTemplateId] = useState("");
  const [previewVariables, setPreviewVariables] = useState({});
  const [previewResult, setPreviewResult] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [testTemplateId, setTestTemplateId] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [testVariables, setTestVariables] = useState({});
  const [testResult, setTestResult] = useState(null);
  const [loadingTest, setLoadingTest] = useState(false);
    const [message, setMessage] = useState(null);
    const [types, setTypes] = useState([]);

  const [loading, setLoading] = useState(false);

  // Fetch all templates
  const fetchTemplates = async () => {
    try {
      setLoading(true);

      // Remove empty filters
      const params = { ...filters };
      Object.keys(params).forEach(
        (key) =>
          (params[key] === "" || params[key] === null) && delete params[key]
      );

      // Convert isActive string to boolean
      if (params.isActive !== undefined) {
        params.isActive = params.isActive === "true";
      }

      const res = await axios.get(
        "http://localhost:5000/api/message-templates",
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );

      if (res.data.success) {
        setTemplates(res.data.data.templates);
        setPagination(res.data.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch template by ID
  const fetchTemplateById = async () => {
    if (!selectedTemplateId) return;

    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/message-templates/${selectedTemplateId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setSelectedTemplate(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching template by ID:", error);
      alert("Template not found");
      setSelectedTemplate(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateUpdate = async (e) => {
    e.preventDefault();
    if (!editingTemplate || !editingTemplate._id) return;

    try {
      setLoading(true);
      const res = await axios.put(
        `http://localhost:5000/api/message-templates/${editingTemplate._id}`,
        {
          name: editingTemplate.name,
          subject: editingTemplate.subject,
          content: editingTemplate.content,
          type: editingTemplate.type,
          category: editingTemplate.category,
          language: editingTemplate.language,
          isActive: editingTemplate.isActive,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert("Template updated successfully");
        setEditingTemplate(null); // close edit form
        fetchTemplates(); // refresh template list
      }
    } catch (error) {
      console.error("Error updating template:", error);
      alert("Failed to update template");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this template?"))
      return;

    try {
      setLoading(true);
      const res = await axios.delete(
        `http://localhost:5000/api/message-templates/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        alert(res.data.message);
        fetchTemplates();
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      alert("Failed to delete template");
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewClick = async () => {
    if (!previewTemplateId) return alert("Enter Template ID");

    try {
      setLoadingPreview(true);
      const res = await axios.post(
        `http://localhost:5000/api/message-templates/${previewTemplateId}/preview`,
        previewVariables,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setPreviewResult(res.data.data);
      }
    } catch (error) {
      console.error("Preview failed:", error);
      alert("Failed to preview template");
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleTestClick = async () => {
    if (!testTemplateId || !testEmail)
      return alert("Enter Template ID and Email");

    try {
      setLoadingTest(true);
      const res = await axios.post(
        `http://localhost:5000/api/message-templates/${testTemplateId}/test`,
        { email: testEmail, variables: testVariables },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setTestResult(res.data.data);
      }
    } catch (error) {
      console.error("Test failed:", error);
      alert("Failed to send test message");
    } finally {
      setLoadingTest(false);
    }
  };


   const fetchTypes = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/message-templates/types", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTypes(res.data.data);
    } catch (err) {
      console.error("Failed to fetch template types", err);
    } finally {
      setLoading(false);
    }
  };


  // Create new template
  const handleMessageTemplateCreate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/message-templates",
        newTemplate,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert("Template created successfully");
        setNewTemplate({
          name: "",
          type: "reminder",
          subject: "",
          content: "",
          language: "en",
          category: "email",
          variables: [],
        });
        fetchTemplates();
      }
    } catch (error) {
      console.error("Error creating template:", error);
      alert("Failed to create template");
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value, page: 1 });
  };

  const handleEditClick = (template) => {
    setEditingTemplate({ ...template });
  };

  // Fetch templates on filter change
  useEffect(() => {
    fetchTemplates();
  }, [
    filters.page,
    filters.type,
    filters.category,
    filters.language,
    filters.isActive,
  ]);

useEffect(() => {
  fetchTypes();
}, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Message Templates</h2>
      {/* Template Types Section */}
<div className="mb-6 p-4 border rounded bg-gray-50">
  <h3 className="font-semibold mb-2">Available Template Types</h3>

  {loading ? (
    <p>Loading types...</p>
  ) : types.length === 0 ? (
    <p className="text-gray-500">No types found</p>
  ) : (
    <table className="min-w-full border border-gray-200">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">Type</th>
          <th className="p-2 border">Name</th>
          <th className="p-2 border">Description</th>
          <th className="p-2 border">Category</th>
        </tr>
      </thead>
      <tbody>
        {types.map((t) => (
          <tr key={t.type} className="hover:bg-gray-50">
            <td className="p-2 border font-mono">{t.type}</td>
            <td className="p-2 border">{t.name}</td>
            <td className="p-2 border">{t.description}</td>
            <td className="p-2 border">{t.category}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>

      {/* Get Template by ID */}
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h3 className="font-semibold mb-2">Get Template by ID</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Template ID"
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
            className="p-2 border rounded w-full"
          />
          <button
            onClick={fetchTemplateById}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Fetch
          </button>
        </div>

        {selectedTemplate && (
          <div className="mt-4 p-3 border rounded bg-white shadow">
            <h4 className="font-bold">{selectedTemplate.name}</h4>
            <p>
              <strong>Subject:</strong> {selectedTemplate.subject || "N/A"}
            </p>
            <p>
              <strong>Content:</strong> {selectedTemplate.content}
            </p>
            <p>
              <strong>Type:</strong> {selectedTemplate.type}
            </p>
            <p>
              <strong>Category:</strong> {selectedTemplate.category}
            </p>
            <p>
              <strong>Language:</strong> {selectedTemplate.language}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {selectedTemplate.isActive ? (
                <span className="text-green-600">Active</span>
              ) : (
                <span className="text-red-600">Inactive</span>
              )}
            </p>
          </div>
        )}
      </div>

      {editingTemplate && (
        <div className="mb-6 p-4 border rounded bg-gray-50">
          <h3 className="font-semibold mb-2">Edit Template</h3>
          <form onSubmit={handleTemplateUpdate}>
            <input
              type="text"
              placeholder="Name"
              value={editingTemplate.name}
              onChange={(e) =>
                setEditingTemplate({ ...editingTemplate, name: e.target.value })
              }
              className="p-2 border rounded w-full mb-2"
              required
            />
            <input
              type="text"
              placeholder="Subject"
              value={editingTemplate.subject || ""}
              onChange={(e) =>
                setEditingTemplate({
                  ...editingTemplate,
                  subject: e.target.value,
                })
              }
              className="p-2 border rounded w-full mb-2"
            />
            <textarea
              placeholder="Content"
              value={editingTemplate.content}
              onChange={(e) =>
                setEditingTemplate({
                  ...editingTemplate,
                  content: e.target.value,
                })
              }
              className="p-2 border rounded w-full mb-2"
              required
            />

            <div className="grid grid-cols-2 gap-2">
              <select
                value={editingTemplate.type}
                onChange={(e) =>
                  setEditingTemplate({
                    ...editingTemplate,
                    type: e.target.value,
                  })
                }
                className="p-2 border rounded"
              >
                <option value="next_topic">Next Topic</option>
                <option value="reminder">Reminder</option>
                <option value="completion_congratulations">Completion</option>
                <option value="welcome">Welcome</option>
                <option value="course_enrollment">Course Enrollment</option>
              </select>

              <select
                value={editingTemplate.category}
                onChange={(e) =>
                  setEditingTemplate({
                    ...editingTemplate,
                    category: e.target.value,
                  })
                }
                className="p-2 border rounded"
              >
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="sms">SMS</option>
                <option value="push">Push</option>
              </select>
            </div>

            <div className="mt-2">
              <select
                value={editingTemplate.language}
                onChange={(e) =>
                  setEditingTemplate({
                    ...editingTemplate,
                    language: e.target.value,
                  })
                }
                className="p-2 border rounded"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="pt">Portuguese</option>
                <option value="hi">Hindi</option>
              </select>
            </div>

            <div className="mt-2">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingTemplate.isActive}
                  onChange={(e) =>
                    setEditingTemplate({
                      ...editingTemplate,
                      isActive: e.target.checked,
                    })
                  }
                />
                Active
              </label>
            </div>

            <button
              type="submit"
              className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded"
            >
              Update Template
            </button>
            <button
              type="button"
              onClick={() => setEditingTemplate(null)}
              className="mt-3 ml-2 px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h3 className="font-semibold mb-2">Preview Template</h3>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Enter Template ID"
            value={previewTemplateId}
            onChange={(e) => setPreviewTemplateId(e.target.value)}
            className="p-2 border rounded w-full"
          />
          <button
            onClick={handlePreviewClick}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Preview
          </button>
        </div>

        {loadingPreview && <p>Loading preview...</p>}

        {previewResult && (
          <div className="mt-4 p-3 border rounded bg-white shadow">
            <h4 className="font-bold">{previewResult.template.name}</h4>
            <p>
              <strong>Type:</strong> {previewResult.template.type}
            </p>
            <p>
              <strong>Category:</strong> {previewResult.template.category}
            </p>
            <hr className="my-2" />
            <p>
              <strong>Rendered Subject:</strong>{" "}
              {previewResult.rendered.subject}
            </p>
            <p>
              <strong>Rendered Content:</strong>
            </p>
            <div className="p-2 border rounded bg-gray-100 whitespace-pre-wrap">
              {previewResult.rendered.content}
            </div>
          </div>
        )}
      </div>
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h3 className="font-semibold mb-2">Test Template</h3>
        <div className="flex flex-col gap-2 mb-2">
          <input
            type="text"
            placeholder="Enter Template ID"
            value={testTemplateId}
            onChange={(e) => setTestTemplateId(e.target.value)}
            className="p-2 border rounded w-full"
          />
          <input
            type="email"
            placeholder="Enter Test Email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            className="p-2 border rounded w-full"
          />
          <textarea
            placeholder="Variables JSON (optional)"
            value={JSON.stringify(testVariables, null, 2)}
            onChange={(e) => {
              try {
                setTestVariables(JSON.parse(e.target.value));
              } catch {
                // Ignore invalid JSON
              }
            }}
            className="p-2 border rounded w-full h-24"
          />
          <button
            onClick={handleTestClick}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Send Test
          </button>
        </div>

        {loadingTest && <p>Sending test message...</p>}

        {testResult && (
          <div className="mt-4 p-3 border rounded bg-white shadow">
            <h4 className="font-bold">Test Result</h4>
            <p>
              <strong>Status:</strong> {testResult.status}
            </p>
            <p>
              <strong>Message SID:</strong> {testResult.messageSid}
            </p>
            <hr className="my-2" />
            <p>
              <strong>Rendered Subject:</strong> {testResult.rendered.subject}
            </p>
            <p>
              <strong>Rendered Content:</strong>
            </p>
            <div className="p-2 border rounded bg-gray-100 whitespace-pre-wrap">
              {testResult.rendered.content}
            </div>
          </div>
        )}
      </div>

      {/* Create New Template */}
      <form
        onSubmit={handleMessageTemplateCreate}
        className="mb-6 p-4 border rounded bg-gray-50"
      >
        <h3 className="font-semibold mb-2">Create New Template</h3>
        <input
          type="text"
          placeholder="Name"
          value={newTemplate.name}
          onChange={(e) =>
            setNewTemplate({ ...newTemplate, name: e.target.value })
          }
          className="p-2 border rounded w-full mb-2"
          required
        />
        <input
          type="text"
          placeholder="Subject (optional)"
          value={newTemplate.subject}
          onChange={(e) =>
            setNewTemplate({ ...newTemplate, subject: e.target.value })
          }
          className="p-2 border rounded w-full mb-2"
        />
        <textarea
          placeholder="Content"
          value={newTemplate.content}
          onChange={(e) =>
            setNewTemplate({ ...newTemplate, content: e.target.value })
          }
          className="p-2 border rounded w-full mb-2"
          required
        />
        <div className="grid grid-cols-2 gap-2">
          <select
            value={newTemplate.type}
            onChange={(e) =>
              setNewTemplate({ ...newTemplate, type: e.target.value })
            }
            className="p-2 border rounded"
          >
            <option value="next_topic">Next Topic</option>
            <option value="reminder">Reminder</option>
            <option value="completion_congratulations">Completion</option>
            <option value="welcome">Welcome</option>
            <option value="course_enrollment">Course Enrollment</option>
          </select>

          <select
            value={newTemplate.category}
            onChange={(e) =>
              setNewTemplate({ ...newTemplate, category: e.target.value })
            }
            className="p-2 border rounded"
          >
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="sms">SMS</option>
            <option value="push">Push</option>
          </select>
        </div>

        <div className="mt-2">
          <select
            value={newTemplate.language}
            onChange={(e) =>
              setNewTemplate({ ...newTemplate, language: e.target.value })
            }
            className="p-2 border rounded"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="pt">Portuguese</option>
            <option value="hi">Hindi</option>
          </select>
        </div>

        <button
          type="submit"
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Create Template
        </button>
      </form>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">All Types</option>
          <option value="next_topic">Next Topic</option>
          <option value="reminder">Reminder</option>
          <option value="completion_congratulations">Completion</option>
          <option value="welcome">Welcome</option>
          <option value="course_enrollment">Course Enrollment</option>
        </select>

        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">All Categories</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="push">Push</option>
        </select>

        <select
          name="language"
          value={filters.language}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">All Languages</option>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="pt">Portuguese</option>
          <option value="hi">Hindi</option>
        </select>

        <select
          name="isActive"
          value={filters.isActive}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {/* Templates Table */}
      {loading ? (
        <p>Loading templates...</p>
      ) : templates.length === 0 ? (
        <p className="text-gray-500">No templates found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border rounded shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Language</th>
                <th className="p-2 border">Active</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((tpl) => (
                <tr key={tpl._id} className="hover:bg-gray-50">
                  <td className="p-2 border">{tpl.name}</td>
                  <td className="p-2 border">{tpl.type}</td>
                  <td className="p-2 border">{tpl.category}</td>
                  <td className="p-2 border">{tpl.language}</td>
                  <td className="p-2 border">
                    {tpl.isActive ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-red-600 font-semibold">No</span>
                    )}
                  </td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleEditClick(tpl)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>
                  </td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleDeleteClick(tpl._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination && (
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={!pagination.hasPrevPage}
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
            }
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            disabled={!pagination.hasNextPage}
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminMessageTemplate;
