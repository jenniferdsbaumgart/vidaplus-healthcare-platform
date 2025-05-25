import React, { useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Upload, X, File, AlertCircle } from 'lucide-react';
import Label from './Label';
import Button from './Button';

interface FileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  error?: string;
  helperText?: string;
  onChange?: (files: File[]) => void;
  value?: File[];
  required?: boolean;
  optional?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept,
  multiple = false,
  maxSize,
  error,
  helperText,
  onChange,
  value = [],
  required,
  optional,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>(value);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const validFiles = Array.from(newFiles).filter(file => {
      if (maxSize && file.size > maxSize) {
        console.warn(`File ${file.name} is too large`);
        return false;
      }
      return true;
    });

    setFiles(validFiles);
    onChange?.(validFiles);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onChange?.(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label required={required} optional={optional}>
          {label}
        </Label>
      )}

      <div
        className={twMerge(
          'border-2 border-dashed rounded-lg p-4 text-center',
          dragActive ? 'border-primary bg-primary/5' : 'border-gray-300',
          error ? 'border-red-300' : ''
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
        />

        <div className="space-y-4">
          <div className="flex flex-col items-center">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              Arraste e solte arquivos aqui ou
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              className="mt-2"
            >
              Selecionar Arquivos
            </Button>
          </div>

          {helperText && (
            <p className="text-xs text-gray-500">{helperText}</p>
          )}
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
            >
              <div className="flex items-center space-x-2">
                <File className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">{file.name}</span>
                <span className="text-xs text-gray-500">
                  ({formatFileSize(file.size)})
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="p-1 hover:bg-gray-200 rounded-full"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <div className="flex items-center space-x-1 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;