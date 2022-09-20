export interface INoteEditorProps {
    onChange:(e: {text: string}) => void,
}

export function NoteEditor(props: INoteEditorProps) {
    return (
        <div className="note-editor">
            <textarea style={{width: "100%", height: "100%", resize: "none"}}
                      onChange={(e) => props.onChange({text: e.target.value})}/>
        </div>
    );
}
