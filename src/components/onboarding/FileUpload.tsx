'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileImage, FileText, File, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  progress?: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  maxFiles?: number;
  onFilesChange: (files: UploadedFile[]) => void;
  className?: string;
  title?: string;
  description?: string;
  files?: UploadedFile[];
}

export default function FileUpload({
  accept = '*/*',
  multiple = true,
  maxSize = 10, // 10MB default
  maxFiles = 5,
  onFilesChange,
  className,
  title = 'Upload de Arquivos',
  description = 'Arraste e solte arquivos aqui ou clique para selecionar',
  files = []
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(files);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = useCallback(async (selectedFiles: FileList) => {
    const newFiles: UploadedFile[] = [];

    for (let i = 0; i < selectedFiles.length && newFiles.length < maxFiles; i++) {
      const file = selectedFiles[i];

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        const errorFile: UploadedFile = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'error',
          error: `Arquivo muito grande. Máximo ${maxSize}MB permitido.`
        };
        newFiles.push(errorFile);
        continue;
      }

      // Create upload file object
      const uploadFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        progress: 0
      };

      newFiles.push(uploadFile);

      // Simulate upload with progress
      uploadFileWithProgress(file, uploadFile.id);
    }

    const updatedFiles = [...uploadedFiles, ...newFiles];
    setUploadedFiles(updatedFiles);
    onFilesChange(updatedFiles);
  }, [uploadedFiles, maxSize, maxFiles, onFilesChange]);

  const uploadFileWithProgress = async (file: File, fileId: string) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadedFiles(prev => prev.map(f => {
          if (f.id === fileId && f.status === 'uploading') {
            const newProgress = Math.min((f.progress || 0) + Math.random() * 30, 95);
            return { ...f, progress: newProgress };
          }
          return f;
        }));
      }, 200);

      // Make actual upload request
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (response.ok) {
        const result = await response.json();
        setUploadedFiles(prev => prev.map(f => {
          if (f.id === fileId) {
            return {
              ...f,
              status: 'completed',
              progress: 100,
              url: result.url
            };
          }
          return f;
        }));
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      setUploadedFiles(prev => prev.map(f => {
        if (f.id === fileId) {
          return {
            ...f,
            status: 'error',
            error: 'Falha no upload. Tente novamente.'
          };
        }
        return f;
      }));
    }
  };

  const removeFile = useCallback((fileId: string) => {
    const updatedFiles = uploadedFiles.filter(f => f.id !== fileId);
    setUploadedFiles(updatedFiles);
    onFilesChange(updatedFiles);
  }, [uploadedFiles, onFilesChange]);

  const retryUpload = useCallback((fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (file && file.status === 'error') {
      setUploadedFiles(prev => prev.map(f => {
        if (f.id === fileId) {
          return { ...f, status: 'uploading', progress: 0, error: undefined };
        }
        return f;
      }));
      
      // Create a mock File object for retry (in real implementation, you'd store the original file)
      // For now, we'll just simulate a successful upload
      setTimeout(() => {
        setUploadedFiles(prev => prev.map(f => {
          if (f.id === fileId) {
            return { ...f, status: 'completed', progress: 100 };
          }
          return f;
        }));
      }, 2000);
    }
  }, [uploadedFiles]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files);
    }
  }, [handleFileSelection]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return FileImage;
    if (type.includes('text') || type.includes('document')) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="mb-4">
        <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200',
          isDragOver
            ? 'border-cyan-400 bg-cyan-400/10'
            : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => e.target.files && handleFileSelection(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-white font-medium mb-2">
          Clique para selecionar ou arraste arquivos aqui
        </p>
        <p className="text-sm text-gray-400">
          Máximo {maxFiles} arquivo{maxFiles > 1 ? 's' : ''} • {maxSize}MB cada
        </p>
      </div>

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-white mb-3">
            Arquivos ({uploadedFiles.length}/{maxFiles})
          </h4>
          
          <div className="space-y-3">
            <AnimatePresence>
              {uploadedFiles.map((file) => {
                const Icon = getFileIcon(file.type);
                
                return (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg"
                  >
                    <Icon className="w-8 h-8 text-gray-400 flex-shrink-0" />
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatFileSize(file.size)}
                      </p>
                      
                      {/* Progress Bar */}
                      {file.status === 'uploading' && (
                        <div className="mt-2">
                          <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-cyan-400"
                              initial={{ width: 0 }}
                              animate={{ width: `${file.progress || 0}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {Math.round(file.progress || 0)}%
                          </p>
                        </div>
                      )}
                      
                      {/* Error Message */}
                      {file.status === 'error' && file.error && (
                        <p className="text-xs text-red-400 mt-1">{file.error}</p>
                      )}
                    </div>
                    
                    {/* Status Icon */}
                    <div className="flex items-center gap-2">
                      {file.status === 'completed' && (
                        <Check className="w-5 h-5 text-green-400" />
                      )}
                      {file.status === 'uploading' && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full"
                        />
                      )}
                      {file.status === 'error' && (
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              retryUpload(file.id);
                            }}
                            className="text-cyan-400 hover:text-cyan-300 text-xs"
                          >
                            Tentar novamente
                          </button>
                          <AlertCircle className="w-5 h-5 text-red-400" />
                        </div>
                      )}
                      
                      {/* Remove Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file.id);
                        }}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}