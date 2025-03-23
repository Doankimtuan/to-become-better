import { useState } from "react";
import { useModal } from "~/components/ModalUseContext";

export default function Welcome() {
  const { alert, confirm, form, custom } = useModal();
  const [formData, setFormData] = useState({ name: "", email: "" });

  // Handle Alert Modal
  const handleShowAlert = () => {
    alert("This is a simple message from useModal hook!", {
      className: "alert-modal",
    });
  };

  // Handle Confirm Modal
  const handleShowConfirm = async () => {
    await confirm("Are you sure you want to perform this action?", {
      onConfirm: () => console.log("Confirmed!"),
      onCancel: () => console.log("Cancelled!"),
    });
  };

  // Form Component for Modal
  const FormContent = () => {
    return (
      <form className="space-y-4">
        <div className="form-group">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name:
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
      </form>
    );
  };

  // Handle Form Modal
  const handleShowForm = async () => {
    await form(<FormContent />, {
      onConfirm: () => console.log("Form submitted with:", formData),
      onCancel: () => console.log("Form cancelled"),
    });
  };

  const CustomContent = () => {
    return (
      <div className="custom-content space-y-4">
        <h4 className="text-lg font-semibold">Custom Content</h4>
        <p className="text-gray-600">
          This is a Modal with complex custom content.
        </p>
        <div className="info-box bg-gray-50 p-4 rounded-lg">
          <h5 className="text-md font-medium mb-2">Detailed Information:</h5>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Item 1: Description</li>
            <li>Item 2: Description</li>
            <li>Item 3: Description</li>
          </ul>
        </div>
        <div className="buttons">
          <button
            onClick={() =>
              alert("This is a nested Modal!", {
                className: "nested-modal",
              })
            }
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Open Nested Modal
          </button>
        </div>
      </div>
    );
  };

  const handleShowCustom = () => {
    custom(<CustomContent />, {
      className: "custom-modal",
      onConfirm: () => console.log("Custom modal confirmed"),
      onCancel: () => console.log("Custom modal cancelled"),
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
        Modal Types Demo
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
        <button
          onClick={handleShowAlert}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
        >
          Simple Alert Modal
        </button>
        <button
          onClick={handleShowConfirm}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md hover:shadow-lg"
        >
          Confirmation Modal
        </button>
        <button
          onClick={handleShowForm}
          className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors shadow-md hover:shadow-lg"
        >
          Form Modal
        </button>
        <button
          onClick={handleShowCustom}
          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg"
        >
          Custom Modal
        </button>
      </div>
    </div>
  );
}
