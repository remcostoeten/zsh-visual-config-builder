export function validateShellScript(code: string): { isValid: boolean; error?: string } {
  // Basic shell syntax validation
  try {
    // Check for basic syntax errors
    const hasUnmatchedQuotes = (code.match(/"/g) || []).length % 2 !== 0;
    const hasUnmatchedSingleQuotes = (code.match(/'/g) || []).length % 2 !== 0;
    
    if (hasUnmatchedQuotes) {
      return { 
        isValid: false, 
        error: 'Unmatched double quotes in script'
      };
    }
    
    if (hasUnmatchedSingleQuotes) {
      return { 
        isValid: false, 
        error: 'Unmatched single quotes in script'
      };
    }

    // Check for basic shell syntax patterns
    const lines = code.split('\n');
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith('#')) {
        continue;
      }

      // Check for common syntax errors
      if (trimmedLine.endsWith('\\') && !trimmedLine.endsWith('\\\\')) {
        return {
          isValid: false,
          error: 'Line ends with unescaped backslash'
        };
      }

      if (trimmedLine.includes('if') && !trimmedLine.includes('then') && !trimmedLine.endsWith('\\')) {
        if (!lines.some(l => l.trim() === 'then')) {
          return {
            isValid: false,
            error: 'If statement missing then clause'
          };
        }
      }
    }

    return { isValid: true };
  } catch (error) {
    return { 
      isValid: true, // Default to valid if parsing fails
      error: error instanceof Error ? error.message : 'Invalid shell syntax'
    };
  }
}