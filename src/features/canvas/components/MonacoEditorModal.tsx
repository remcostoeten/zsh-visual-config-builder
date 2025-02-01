import React, { useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { validateShellScript } from '@/utils/shellValidation';
import ShellHelpers from './ShellHelpers';

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
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleContentChange = (value: string = '') => {
    setEditorContent(value);
    setValidation(validateShellScript(value));
  };

  const handleInsertSnippet = (code: string) => {
    if (editorRef.current) {
      const position = editorRef.current.getPosition();
      const lineContent = editorRef.current.getModel().getLineContent(position.lineNumber);
      const indentation = lineContent.match(/^\s*/)?.[0] || '';
      
      // Add a newline if we're not at the start of a line
      const insertText = position.column > 1 ? '\n' + code : code;
      
      // Format the snippet with proper indentation
      const formattedCode = insertText
        .split('\n')
        .map((line, index) => index === 0 ? line : indentation + line)
        .join('\n');

      editorRef.current.executeEdits('shell-helper', [{
        range: {
          startLineNumber: position.lineNumber,
          startColumn: position.column,
          endLineNumber: position.lineNumber,
          endColumn: position.column
        },
        text: formattedCode
      }]);

      // Update the content state
      const newContent = editorRef.current.getValue();
      setEditorContent(newContent);
      setValidation(validateShellScript(newContent));
      
      // Focus back on the editor
      editorRef.current.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1E1E1E] rounded-lg w-[1200px] h-[800px] p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-medium text-white">{title}</h2>
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
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                autoIndent: 'full',
                formatOnPaste: true,
              }}
            />
          </div>
          <div className="w-[300px]">
            <ShellHelpers onInsertSnippet={handleInsertSnippet} />
          </div>
        </div>
      </div>
    </div>
  );
}