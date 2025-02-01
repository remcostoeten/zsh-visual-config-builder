import React from 'react';
import Editor from '@monaco-editor/react';
import { validateShellScript } from '../utils/shellValidation';
import ShellHelpers from './ShellHelpers';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  onSave: (content: string) => void;
}

export default function MonacoEditorModal({ isOpen, onClose, title, content, onSave }: Props) {
  const [editorContent, setEditorContent] = React.useState(content);
  const [validation, setValidation] = React.useState({ isValid: true });

  const handleContentChange = (value: string = '') => {
    setEditorContent(value);
    setValidation(validateShellScript(value));
  };

  const handleInsertSnippet = (code: string) => {
    setEditorContent(prev => prev + '\n' + code);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle className="text-lg font-medium text-white">{title}</DialogTitle>
        <div className="flex justify-between items-center mb-4">
          <div>
            {!validation.isValid && (
              <p className="text-sm text-red-400 mt-1">{validation.error}</p>
            )}
          </div>
          <div className="space-x-2">
            <button 
              onClick={() => onSave(editorContent)}
              className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              disabled={!validation.isValid}
            >
              Save
            </button>
            <button 
              onClick={onClose}
              className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
        <div className="flex gap-4 h-[calc(100%-60px)]">
          <div className="flex-1">
            <Editor
              height="100%"
              value={editorContent}
              language="shell"
              theme="vs-dark"
              onChange={handleContentChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
          <div className="w-[300px]">
            <ShellHelpers onInsertSnippet={handleInsertSnippet} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}