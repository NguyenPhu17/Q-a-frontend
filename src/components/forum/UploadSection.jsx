import React from 'react';
import { FiUpload, FiFile } from 'react-icons/fi';

export default function UploadSection({ selectedImages, selectedFiles, onImagesChange, onFilesChange, removeImage, removeFile }) {
    return (
        <div className="flex gap-6 mt-4">
            <div className="flex-1">
                <label className="block mb-3 font-medium">Tải ảnh lên</label>
                <div className="flex gap-4 items-start">
                    <label className="w-40 cursor-pointer px-4 py-2 rounded-md bg-gray-200 text-gray-800 font-semibold border border-gray-300 hover:bg-gray-300 shadow-sm inline-flex items-center gap-2">
                        <FiUpload className="text-lg" /> Chọn ảnh
                        <input type="file" accept="image/*" multiple onChange={onImagesChange} className="hidden" />
                    </label>
                    {selectedImages.length > 0 && (
                        <ul className="flex-1 border rounded p-2 text-sm text-gray-700 max-h-[5.5rem] overflow-y-auto flex flex-wrap gap-2">
                            {selectedImages.map((img, idx) => (
                                <li key={`img-${idx}`} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                                    <span>{img.name}</span>
                                    <button onClick={() => removeImage(idx)} className="text-red-500 hover:text-red-700 font-bold">×</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="flex-1">
                <label className="block mb-3 font-medium">Tải tệp lên</label>
                <div className="flex gap-4 items-start">
                    <label className="w-36 cursor-pointer px-4 py-2 rounded-md bg-gray-200 text-gray-800 font-semibold border border-gray-300 hover:bg-gray-300 shadow-sm inline-flex items-center gap-2">
                        <FiFile className="text-lg" /> Chọn tệp
                        <input type="file" multiple onChange={onFilesChange} className="hidden" />
                    </label>
                    {selectedFiles.length > 0 && (
                        <ul className="flex-1 border rounded p-2 text-sm text-gray-700 max-h-[5.5rem] overflow-y-auto flex flex-wrap gap-2">
                            {selectedFiles.map((file, idx) => (
                                <li key={`file-${idx}`} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                                    <span>{file.name}</span>
                                    <button onClick={() => removeFile(idx)} className="text-red-500 hover:text-red-700 font-bold">×</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
