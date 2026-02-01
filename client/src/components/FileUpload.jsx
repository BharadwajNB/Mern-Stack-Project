import { useState, useRef } from 'react';

const FileUpload = ({ onFilesChange, maxFiles = 5 }) => {
    const [files, setFiles] = useState([]);
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef(null);

    const handleFiles = (newFiles) => {
        const validFiles = Array.from(newFiles).filter(file => {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
            const maxSize = 5 * 1024 * 1024; // 5MB
            return validTypes.includes(file.type) && file.size <= maxSize;
        });

        const updatedFiles = [...files, ...validFiles].slice(0, maxFiles);
        setFiles(updatedFiles);
        onFilesChange(updatedFiles);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
    };

    const removeFile = (index) => {
        const updated = files.filter((_, i) => i !== index);
        setFiles(updated);
        onFilesChange(updated);
    };

    return (
        <div className="file-upload-container">
            <div
                className={`upload-zone ${dragOver ? 'dragover' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
            >
                <div className="upload-icon">📁</div>
                <p className="upload-text">
                    Drag & drop files here or <span className="upload-link">browse</span>
                </p>
                <p className="upload-hint">JPEG, PNG, GIF, PDF up to 5MB (max {maxFiles} files)</p>
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.gif,.pdf"
                    onChange={(e) => handleFiles(e.target.files)}
                    style={{ display: 'none' }}
                />
            </div>

            {files.length > 0 && (
                <div className="file-list">
                    {files.map((file, index) => (
                        <div key={index} className="file-item">
                            <span className="file-icon">
                                {file.type.includes('pdf') ? '📄' : '🖼️'}
                            </span>
                            <span className="file-name">{file.name}</span>
                            <span className="file-size">
                                {(file.size / 1024).toFixed(1)}KB
                            </span>
                            <button
                                type="button"
                                className="file-remove"
                                onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                .file-upload-container {
                    margin-bottom: 1rem;
                }

                .upload-icon {
                    font-size: 2rem;
                    margin-bottom: 0.5rem;
                }

                .upload-text {
                    color: var(--color-text-secondary);
                    margin: 0 0 0.25rem 0;
                }

                .upload-link {
                    color: var(--color-primary);
                    font-weight: 500;
                }

                .upload-hint {
                    font-size: 0.75rem;
                    color: var(--color-text-muted);
                    margin: 0;
                }

                .file-list {
                    margin-top: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .file-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 0.75rem;
                    background: var(--color-bg-tertiary);
                    border-radius: var(--radius-md);
                    font-size: 0.875rem;
                }

                .file-icon {
                    font-size: 1rem;
                }

                .file-name {
                    flex: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: var(--color-text-primary);
                }

                .file-size {
                    color: var(--color-text-muted);
                    font-size: 0.75rem;
                }

                .file-remove {
                    background: none;
                    border: none;
                    color: var(--color-danger);
                    cursor: pointer;
                    padding: 0.25rem;
                    font-size: 0.875rem;
                    opacity: 0.7;
                    transition: opacity var(--transition-fast);
                }

                .file-remove:hover {
                    opacity: 1;
                }
            `}</style>
        </div>
    );
};

export default FileUpload;
