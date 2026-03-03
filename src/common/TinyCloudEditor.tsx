import { Box, CircularProgress, Typography } from '@mui/material';
import { useEffect, useId, useRef, useState } from 'react';

type TinyEditorInstance = {
  getContent: () => string;
  setContent: (content: string) => void;
  on: (event: string, callback: () => void) => void;
  remove: () => void;
};

type TinyMceGlobal = {
  init: (options: Record<string, unknown>) => Promise<TinyEditorInstance[]>;
  get: (id: string) => TinyEditorInstance | null;
};

declare global {
  interface Window {
    tinymce?: TinyMceGlobal;
  }
}

interface TinyCloudEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  minHeight?: number;
}

const borderColor = '#d7deea';
const tinyApiKey = import.meta.env.VITE_TINYMCE_API_KEY || 'no-api-key';
let tinyScriptPromise: Promise<TinyMceGlobal> | null = null;

const loadTinyMce = () => {
  if (window.tinymce) {
    return Promise.resolve(window.tinymce);
  }

  if (tinyScriptPromise) {
    return tinyScriptPromise;
  }

  tinyScriptPromise = new Promise<TinyMceGlobal>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[data-tiny-cloud="true"]');

    if (existingScript) {
      existingScript.addEventListener('load', () => {
        if (window.tinymce) {
          resolve(window.tinymce);
          return;
        }

        reject(new Error('TinyMCE did not initialize.'));
      });
      existingScript.addEventListener('error', () => reject(new Error('Failed to load TinyMCE.')));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://cdn.tiny.cloud/1/${tinyApiKey}/tinymce/7/tinymce.min.js`;
    script.referrerPolicy = 'origin';
    script.async = true;
    script.dataset.tinyCloud = 'true';
    script.onload = () => {
      if (window.tinymce) {
        resolve(window.tinymce);
        return;
      }

      reject(new Error('TinyMCE did not initialize.'));
    };
    script.onerror = () => reject(new Error('Failed to load TinyMCE.'));
    document.head.appendChild(script);
  });

  return tinyScriptPromise;
};

const TinyCloudEditor = ({
  value,
  onChange,
  disabled = false,
  minHeight = 280,
}: TinyCloudEditorProps) => {
  const editorId = useId().replace(/:/g, '-');
  const editorRef = useRef<TinyEditorInstance | null>(null);
  const hasMountedRef = useRef(false);
  const onChangeRef = useRef(onChange);
  const valueRef = useRef(value);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    let isActive = true;

    const initialize = async () => {
      try {
        const tinymce = await loadTinyMce();
        if (!isActive || editorRef.current) return;

        const [editor] = await tinymce.init({
          selector: `#${editorId}`,
          menubar: false,
          branding: false,
          statusbar: false,
          min_height: minHeight,
          resize: false,
          plugins: 'lists link autolink emoticons',
          toolbar:
            'undo redo | blocks | bold italic underline | bullist numlist | link | alignleft aligncenter alignright | removeformat',
          content_style:
            "body { font-family: Helvetica, Arial, sans-serif; font-size: 14px; color: #0f172a; }",
          setup: (currentEditor: TinyEditorInstance) => {
            currentEditor.on('init', () => {
              currentEditor.setContent(valueRef.current || '');
              if (isActive) {
                setIsLoading(false);
              }
            });

            currentEditor.on('change input undo redo keyup setcontent', () => {
              onChangeRef.current(currentEditor.getContent());
            });
          },
          readonly: disabled,
        });

        if (!isActive) {
          editor?.remove();
          return;
        }

        editorRef.current = editor ?? tinymce.get(editorId);
        setLoadError(null);
      } catch (error) {
        if (!isActive) return;
        setLoadError(error instanceof Error ? error.message : 'Could not load the editor.');
        setIsLoading(false);
      }
    };

    initialize();
    hasMountedRef.current = true;

    return () => {
      isActive = false;
      editorRef.current?.remove();
      editorRef.current = null;
    };
  }, [editorId, minHeight, disabled]);

  useEffect(() => {
    if (!hasMountedRef.current || !editorRef.current) {
      return;
    }

    const currentValue = editorRef.current.getContent();
    if (currentValue !== value) {
      editorRef.current.setContent(value || '');
    }
  }, [value]);

  return (
    <Box
      sx={{
        position: 'relative',
        border: `1px solid ${borderColor}`,
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: 'white',
      }}
    >
      {isLoading ? (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
          }}
        >
          <CircularProgress size={18} />
          <Typography sx={{ color: '#475569', fontSize: 13 }}>Loading editor...</Typography>
        </Box>
      ) : null}

      {loadError ? (
        <Box sx={{ p: 2 }}>
          <Typography sx={{ color: '#b91c1c', fontSize: 13, fontWeight: 700 }}>Editor unavailable</Typography>
          <Typography sx={{ color: '#64748b', fontSize: 13, mt: 0.5 }}>{loadError}</Typography>
        </Box>
      ) : (
        <textarea id={editorId} defaultValue={value} />
      )}
    </Box>
  );
};

export default TinyCloudEditor;
