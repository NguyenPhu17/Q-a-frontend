import React, { useState, useRef } from 'react';
import MarkdownPreview from './MarkdownPreview';
import Toolbar from './Toolbar';
import UploadSection from './UploadSection';
import {
  useTextFormatting,
  useInsertList,
  useAutoList,
} from '../../hooks/editorHooks';

export default function PostForm({ onClose }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const textareaRef = useRef(null);
  const cursorPosRef = useRef(null);

  const handleContentChange = (e) => setContent(e.target.value);

  const {
    insertAtCursor,
    insertAlignAtCursor,
  } = useTextFormatting(textareaRef, setContent);

  const { insertListAtCursor } = useInsertList(textareaRef, setContent);

  const { handleContentKeyDown } = useAutoList(
    textareaRef,
    setContent,
    cursorPosRef,
    content
  );

  const handleImagesChange = (e) => setSelectedImages(prev => [...prev, ...Array.from(e.target.files)]);
  const handleFilesChange = (e) => setSelectedFiles(prev => [...prev, ...Array.from(e.target.files)]);

  const removeImage = (index) => setSelectedImages(prev => prev.filter((_, i) => i !== index));
  const removeFile = (index) => setSelectedFiles(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Title: ${title}\nContent: ${content}\nHashtags: ${hashtags}`);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto bg-white p-6 rounded-md shadow-md">
      <button
        onClick={onClose}
        className="absolute top-4 right-6 text-gray-600 hover:text-red-600 text-3xl font-bold"
        type="button"
        aria-label="Đóng form"
      >
        &times;
      </button>

      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold text-center mb-2">Tạo bài viết mới</h2>

        <div>
          <label className="block mb-2 font-medium" htmlFor="title">Chủ đề <span className="text-red-500">*</span></label>
          <textarea
            id="title"
            required
            rows={3}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-1 resize-none overflow-y-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập chủ đề bài viết"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium" htmlFor="content">Nội dung <span className="text-red-500">*</span></label>
          <Toolbar {...{ insertAtCursor, insertAlignAtCursor, insertListAtCursor }} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3" style={{ minHeight: '125px' }}>
            <textarea
              id="content"
              ref={textareaRef}
              required
              rows={6}
              value={content}
              onChange={handleContentChange}
              onKeyDown={handleContentKeyDown}
              className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none overflow-y-auto focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder="Viết nội dung bài viết bằng Markdown..."
              style={{ minHeight: '125px' }}
            />
            <MarkdownPreview content={content} />
          </div>
        </div>

        <div>
          <label className="block mb-3 font-medium" htmlFor="hashtags">Hashtags (cách nhau bằng dấu cách)</label>
          <input
            id="hashtags"
            type="text"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="#tag1 #tag2 #tag3"
          />
        </div>

        <UploadSection
          selectedImages={selectedImages}
          selectedFiles={selectedFiles}
          onImagesChange={handleImagesChange}
          onFilesChange={handleFilesChange}
          removeImage={removeImage}
          removeFile={removeFile}
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl transition-colors font-semibold"
        >
          Đăng bài
        </button>
      </form>
    </div>
  );
}
