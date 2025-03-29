import React, { useState } from "react";

const EditQuestionModal = ({ isOpen, onClose, question, onSave }) => {
  if (!isOpen || !question) return null;

  const [editedQuestion, setEditedQuestion] = useState(question);

  const handleChange = (e) => {
    setEditedQuestion((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...editedQuestion.options];
    newOptions[index] = value;
    setEditedQuestion((prev) => ({
      ...prev,
      options: newOptions,
    }));
  };
  return (
    <div>
      <div className="fixed inset-0 flex items-center justify-center z-95 backdrop-blur-xs shadow-2xl overflow-y-scroll">
        <div className="bg-gray-100 p-6 rounded-2xl w-lg md:w-xl lg:w-2xl mx-4 md:mx-0">
          <h2 className="text-lg md:text-2xl font-bold mb-4">Edit Question</h2>

          {/* Question Input */}
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Question Text
          </label>
          <textarea
            name="question_text"
            value={editedQuestion.question_text}
            onChange={handleChange}
            className="w-full border-gray-200 border-2 p-4 mb-4 bg-white rounded-2xl shadow-xl font-semibold text-gray-700 text-sm md:text-lg"
          />

          {/* Options Editing */}
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {editedQuestion?.question_type === 'MCQ' || editedQuestion?.question_type === 'Multiple Choice' ? 'Answer Options' : ''}
          </label>
          <div className="space-y-1 md:space-y-2">
            {editedQuestion.options?.map((option, index) => (
              <input
                key={index}
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="min-w-[42] border-gray-200 border-2 p-2 m-3 bg-white rounded-2xl shadow-xl font-semibold text-cyy text-gray-700 text-sm md:text-lg"
              />
            ))}
          </div>

          {/* Answer Editing */}
          {(editedQuestion.question_type !== 'Written' && editedQuestion.question_type !== 'Essay' && editedQuestion.question_type !== 'Short Answer') && <div >
          <label
            className="block text-gray-700 text-sm font-bold m-2"
            htmlFor="answer"
          >
            Answer
          </label>
          <div className="space-y-2">
            <input
              type="text"
              name="answer"
              className="min-w-[42] border-gray-200 border-2 p-2 mb-1 bg-white rounded-2xl shadow-xl font-semibold text-cyy text-gray-700 text-sm md:text-lg"
              value={editedQuestion.answer}
              onChange={handleChange}
            />
          </div>
          </div>}

          {/* Buttons */}
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-3 md:px-7 py-2 font-semibold bg-white text-gray-700 text-sm md:text-lg rounded-lg shadow-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(editedQuestion)}
              className="px-3 md:px-7 py-2 font-semibold bg-black text-white text-sm md:text-lg rounded-lg"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditQuestionModal;
