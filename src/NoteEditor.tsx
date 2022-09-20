export interface INoteEditorProps {
    onChange:(e: {text: string}) => void,
}

export function NoteEditor(props: INoteEditorProps) {
    return (
        <div className="note-editor">
        </div>
    );
}
