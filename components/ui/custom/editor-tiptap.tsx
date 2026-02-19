import { cn } from '@/lib/utils';
import StarterKit from '@tiptap/starter-kit';
import { UseFormReturn } from 'react-hook-form';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { useEditor, EditorContent } from '@tiptap/react';
import {
  Bold,
  Italic,
  UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from 'lucide-react';

interface EditorTiptapProps {
  label: string;
  className?: string;
  form: UseFormReturn<any>;
  name: string;
}

const EditorTiptap = ({ label, className, form, name }: EditorTiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle.extend({
        addAttributes() {
          return {
            fontSize: {
              default: '18px',
              parseHTML: (element) => element.style.fontSize || '18px',
              renderHTML: (attributes) => {
                if (!attributes.fontSize) return { style: 'font-size: 18px' };
                return {
                  style: `font-size: ${attributes.fontSize}`,
                };
              },
            },
          };
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: form.watch(name) || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      form.setValue(name, editor.getHTML(), { shouldDirty: true });
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[400px] p-4',
        style: 'font-family: Arial, sans-serif;',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className={cn('mb-4', className)}>
      <label className='mb-2 block text-sm font-normal'>{label}</label>

      {/* Barra de herramientas */}
      <div className='border-input flex gap-1 rounded-t-md border p-2'>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`bg-background hover:bg-primary/90 rounded border p-2 ${editor.isActive('bold') ? 'bg-muted-foreground' : ''}`}
          title='Negrita'
        >
          <Bold size={18} />
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`bg-background hover:bg-primary/90 rounded p-2 ${editor.isActive('italic') ? 'bg-muted-foreground' : ''}`}
          title='Itálica'
        >
          <Italic size={18} />
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`bg-background hover:bg-primary/90 rounded p-2 ${editor.isActive('underline') ? 'bg-muted-foreground' : ''}`}
          title='Subrayado'
        >
          <UnderlineIcon size={18} />
        </button>
        <div className='bg-border mx-1 w-px'></div>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`bg-background hover:bg-primary/90 rounded p-2 ${editor.isActive('bulletList') ? 'bg-muted-foreground' : ''}`}
          title='Lista con viñetas'
        >
          <List size={18} />
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`bg-background hover:bg-primary/90 rounded p-2 ${editor.isActive('orderedList') ? 'bg-muted-foreground' : ''}`}
          title='Lista numerada'
        >
          <ListOrdered size={18} />
        </button>
        <div className='bg-border mx-1 w-px'></div>
        <button
          type='button'
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`bg-background hover:bg-primary/90 rounded p-2 ${editor.isActive({ textAlign: 'left' }) ? 'bg-muted-foreground' : ''}`}
          title='Alinear a la izquierda'
        >
          <AlignLeft size={18} />
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`bg-background hover:bg-primary/90 rounded p-2 ${editor.isActive({ textAlign: 'center' }) ? 'bg-muted-foreground' : ''}`}
          title='Centrar'
        >
          <AlignCenter size={18} />
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`bg-background hover:bg-primary/90 rounded p-2 ${editor.isActive({ textAlign: 'right' }) ? 'bg-muted-foreground' : ''}`}
          title='Alinear a la derecha'
        >
          <AlignRight size={18} />
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`bg-background hover:bg-primary/90 rounded p-2 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-muted-foreground' : ''}`}
          title='Justificar'
        >
          <AlignJustify size={18} />
        </button>
        <div className='bg-border mx-1 w-px'></div>
        <select
          onChange={(e) => {
            const fontSize = e.target.value;
            setTimeout(() => {
              if (fontSize) {
                editor.chain().focus().setMark('textStyle', { fontSize }).run();
              } else {
                editor.chain().focus().unsetMark('textStyle').run();
              }
            }, 0);
          }}
          className='bg-background hover:bg-primary/90 rounded border px-2 py-2 text-sm'
          title='Tamaño de fuente'
        >
          <option value=''>Tamaño</option>
          <option value='10px'>10px</option>
          <option value='12px'>12px</option>
          <option value='14px'>14px</option>
          <option value='16px'>16px</option>
          <option value='18px'>18px</option>
          <option value='20px'>20px</option>
          <option value='24px'>24px</option>
          <option value='28px'>28px</option>
          <option value='32px'>32px</option>
        </select>
      </div>

      {/* Editor */}
      <div className='border-input rounded-b-md border border-t-0'>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export { EditorTiptap };
